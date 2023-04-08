<!--
title: Send an object via MPI using serialization
slug: notes/mpi-using-serialization
date: 2022-11-27
description: Send an object via MPI using serialization.
categories: C++, MPI
-->

In progress

To send an object instance with MPI, there are three main options:

1. Serialize the object into a byte string and send that. This involves converting the object into a binary format that can be reconstructed elsewhere.
2. Send each attribute of the object separately and reassemble it at the receiving end.
3. Register the object as an MPI data type. This defines how the object should be laid out in memory so MPI knows how to send its constituent parts.

Option 1, serialization, is a common approach. It requires a serialization library like Boost.Serialization to convert the object into a byte stream. Then MPI_Send() can be used to send the string, and MPI_Recv() used to receive it, before deserializing it into an object again.

Present simple exemple of serialization → send → deserialization

## Ressources

- [How to send a set object in MPI_Send](https://stackoverflow.com/questions/31014044/how-to-send-a-set-object-in-mpi-send)

- [Can't get C++ Boost Pointer Serialization to work](https://stackoverflow.com/questions/28901596/cant-get-c-boost-pointer-serialization-to-work)

- [boost serialization of dynamic arrays](https://stackoverflow.com/questions/21408521/boost-serialization-of-dynamic-arrays)

- [Serialization/Deserialization of a Vector of Integers in C++](https://stackoverflow.com/questions/51230764/serialization-deserialization-of-a-vector-of-integers-in-c)
