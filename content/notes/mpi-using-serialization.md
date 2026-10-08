<!--
title: Send an object via MPI using serialization
slug: notes/mpi-using-serialization
date: 2023-03-27
description: Send an object via MPI using serialization.
categories: C++, MPI
-->

There are three main ways to send an object with MPI:

- Serialize the object into a byte string and send that. This involves converting the object into a binary format that can be reconstructed elsewhere.
- Send each attribute of the object separately and reassemble it at the receiving end.
- Register the object as an MPI data type. This defines how the object should be laid out in memory so MPI knows how to send its constituent parts.

## Serialization

With Boost.Serialization, you convert the object into a byte stream, send it with `MPI_Send`, and receive it with `MPI_Recv`. The receiving process deserializes the stream to reconstruct the object.

(In progress)

The example is still to be written: serialize an object, send it, then deserialize it on the receiving process.

## Resources

- [How to send a set object in MPI_Send](https://stackoverflow.com/questions/31014044/how-to-send-a-set-object-in-mpi-send)

- [Can't get C++ Boost Pointer Serialization to work](https://stackoverflow.com/questions/28901596/cant-get-c-boost-pointer-serialization-to-work)

- [boost serialization of dynamic arrays](https://stackoverflow.com/questions/21408521/boost-serialization-of-dynamic-arrays)

- [Serialization/Deserialization of a Vector of Integers in C++](https://stackoverflow.com/questions/51230764/serialization-deserialization-of-a-vector-of-integers-in-c)
