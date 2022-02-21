---
title: "Looking up values in a TMap/TSet with just the hash key."
categories:
  - Blog
tags:
  - unreal
  - tricks
image:
  feature: /assets/images/hashlookupwithoutthewholekey.png
  thumb: /assets/images/hashlookupwithoutthewholekey.png
---

![The Goal](/assets/images/hashlookupwithoutthewholekey.png)

How do you look up a value in a TMap/TSet without the underlying key type?


Let's say you just have the hash key (`uint32` that you can get from `GetTypeHash`) and nothing else. Do not fret!


# The Resolution (Code)

I've crafted some helpers util's to help you find a value inside of any TMap (easily translates to TSet). Here's how you use `TTypeHashOnlyKeyFunc`:

```cpp

// DO NOT USE the TTypeHashOnlyKeyFunc as a actual KeyFunc on your map/set, it is only worth using for anything lookup related.
TMap<FExampleKey, FExampleValue> KeyValueMap;


uint32 HashKey = GetTypeHash(Key);
TTypeHashOnlyKeyFunc<FExampleKey, FExampleValue>::FHashHelper Comparable(HashKey);
FExampleValue* Value = Comparable.FindByHash(KeyValueMap);

if(Value)
{
  // Woohoo
}

```


```cpp

template <typename TKeyType, typename TValueType, bool bInAllowDuplicateKeys = false, typename TSetAllocator = FDefaultSetAllocator>
struct TTypeHashOnlyKeyFunc : public TDefaultMapKeyFuncs<TKeyType, TValueType, bInAllowDuplicateKeys>
{
  // Type that is the same size as the key type, the KeyFunc functions expect a key type, so let's just pretend to be one! Only tested with TMap's FindByHash.
  struct FHashHelper
  {
    static constexpr uint32 ByteRemainder = std::max(sizeof(uint32), sizeof(TKeyType)) - sizeof(uint32);

    FHashHelper(const uint32& Key) : Key(Key), RemainderBytes{}
    {
    };

    uint32 Key;
    uint8  RemainderBytes[ByteRemainder];

    TKeyType GetComparable() const
    {
      // We are the key! (not)
      return reinterpret_cast<const TKeyType&>(*this);
    }

    using FTypeHashOnlyMap = TMap<TKeyType, TValueType, TSetAllocator, TTypeHashOnlyKeyFunc<
                                    TKeyType, TValueType, bInAllowDuplicateKeys, TSetAllocator>>;


    TValueType* FindByHash(TMap<TKeyType, TValueType, TSetAllocator>& MapType) const
    {
      // let's pretend you have our KeyFunc handler instead!
      return reinterpret_cast<FTypeHashOnlyMap&>(MapType).FindByHash(Key, GetComparable());
    }
  };

  static_assert(sizeof(FHashHelper) == sizeof(TKeyType), "FHashKey must match the size of the key type!");


  FORCEINLINE static bool Matches(TKeyType A, TKeyType B)
  {
    const uint32 KeyA = reinterpret_cast<FHashHelper&>(A).Key;
    const uint32 KeyB = reinterpret_cast<FHashHelper&>(B).Key;

    return KeyA == KeyB;
  }


  FORCEINLINE static typename TEnableIf<sizeof(FHashHelper) == sizeof(TKeyType), TKeyType>::Type GetSetKey(
    typename TTypeHashOnlyKeyFunc::ElementInitType Element)
  {
    static_assert(sizeof(TKeyType) >= 4, "The key type has to be bigger than 4 bytes!");

    FHashHelper KeyHack(TTypeHashOnlyKeyFunc::GetKeyHash(Element.Key));
    return reinterpret_cast<TKeyType&>(KeyHack);
  }
};

```


# The Explanation

```cpp
template<typename KeyType, typename ValueType, typename SetAllocator /*= FDefaultSetAllocator*/, typename KeyFuncs /*= TDefaultMapHashableKeyFuncs<KeyType,ValueType,false>*/>
class TMap : public TSortableMapBase<KeyType, ValueType, SetAllocator, KeyFuncs>
//                                                                                              ^                                                                                  
// ------------------------------------------------------------------------->                   |
//                                                                                              right here!
```

Turns out Epic's container types let you implement your own KeyFuncs handler(s)! By default TMap's uses a `TDefaultMapHashableKeyFuncs<KeyType,ValueType,false>` KeyFunc, so what do the KeyFuncs handlers do? 
They act as middlemen for the underlying hash map and set containers, offering static compile time functions that containers use to check for: 
* key equality using `Matches(KeyLHS, KeyRHS)`
* key type hash function `GetKeyHash(KeyType)`,
* getting the key from a the key/value pair `GetSetKey(Element/* A key value pair*/)` 

and so on. It is really nice being able to override the default container behavior through a template type argument. Which is especially useful if you want to have different hashing behavior per container without changing the underlying key type. 

## The Example

For example, if you have a regular old string and didn't want to pay for a costly string hash function operation, you could implement a more performant hashing function directly into the container type without ever having to make a new string type. Pretty neat, huh?

## The Underlying logic

With that out of the way, let me present you with a joke: A map container, a hash key and no one else walks into a bar...


Wait let me try that again: 
What if you only had a set/map, a hash key you got from wherever and nothing else. You know that the underlying hash key represents a key inside of that map, unfortunately there's no easy way of looking it up. 

You see by default TSet/TMap needs the whole type to look up the correct value, as the hash key simply points to the underlying hash bucket and from then on out it is a O(n) search, which compares each element in the hash bucket chain[^1] through a equality operation, calling `Matches` in the KeyFuncs type. We can get around that limitation though, instead of just using the hash key for the hash bucket lookup, let's use it for underlying equality check as well. Problem solved! Note: this method isn't perfect, as you are the mercy of your hash function. If you can somehow manage a collision, the usual equality check will not save you. Although you potentially have 2^32 -1 possible hashes, so that's alright.

[^1]: Chain, I don't mean a closed address linked list bucket. The actual chain's memory is still contiguous (Open addressing) (TSparseArray: the memory is contiguous, but the elements are not necessarily next to each other in memory). 

Thanks for reading!