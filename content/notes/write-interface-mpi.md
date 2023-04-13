<!--
title: Write a header-only object oriented interface around MPI
slug: notes/write-interface-mpi
date: 2023-04-07
description: Write interface around MPI.
categories: C++, MPI
-->

**`tl;dr: I have written a simple header-only MPI interface in C++.`**

The developments are availible here [human.mpi](https://github.com/kennethassogba/human.mpi)

MPI, or Message Passing Interface, is a standardized library for writing parallel programs in a distributed environment. It has become a standard in scientific computing and many legacy computing codes are progressively integrating MPI in view of the move to distributed computing architectures.

## Problem

The addition of MPI communications within an existing computational code can lead to difficulties in readability and maintainability. This is partly because the physics (or math) + communications code mix is difficult to read. A good way to integrate MPI into existing code can be to encapsulate the MPI functions in a class with a simple interface. This is what Boost::MPI offers, for example.

## Proposal

I have written a header-only interface - so easy to integrate in an existing code - which provides a simpler way to write MPI messages.

This interface handle some of the more complex details of the library thus making it easier for developers to write parallel programs.

In addition it is easier to port existing MPI programs to different platforms or environments, as the wrapper provide a consistent interface that is independent of the underlying implementation of MPI.

## A simple broadcast example

```cpp
#include <string>
#include <iostream>
#include "human/mpi.hpp"

int main() {

 human::mpi::communicator world();
 auto rank = world.rank();
 auto size = world.size();
 std::cout << "Process " << rank << "/" << size << std::endl;

 std::string msg;
 if (world.rank() == world.root()) msg = "Hello";

 world.bcast(msg);
 std::cout << "Process" << rank << " " << msg << std::endl;

 return 0;
}
```

Here, `msg` is sent to all non-root processes (0 by default). In reality the sending is done in two steps. First the size is broadcasted and the non-root resize the `msg` to the size received. Finally the `msg` content is sent. When the `communicator` instance goes out of scope (e.g., at the end of the `main` function), the destructor will be called, which will finalize the MPI library.

The equivalent in pure MPI would be

```cpp
#include <string>
#include <iostream>
#include "human/mpi.hpp"

int main(int argc, char* argv[]) {

 MPI_Init(&argc, &argv);

 int rank = 0;
 MPI_Comm_rank(MPI_COMM_WORLD, &rank);

 int size = 0;
 MPI_Comm_size(MPI_COMM_WORLD, &size);

 int root = 0;

 std::cout << "Process " << rank << "/" << size << std::endl;

 std::string msg;
 if (rank == root) msg = "Hello";

 world.bcast(msg);

 int msg_size = msg.size();

 MPI_Bcast(&msg_size, 1, MPI_INT, root, MPI_COMM_WORLD);

 if (rank != root) msg.resize(msg_size);

 MPI_Bcast(msg.c_str(), msg_size, MPI_BYTE, root, MPI_COMM_WORLD);

 std::cout << "Process" << rank << " " << msg << std::endl;

 MPI_Finalize();

 return 0;
}
```

## A simple point-to-point communication

Here is an example of how to use the wrapper to `send` a message between two processes.

```cpp
std::string msg_sent, msg_recv;
int other;

if (world.rank() == world.root())
{
 msg_sent = "Hello";
 other = 1;
}
else
{
 msg_sent = "world!";
 other = 0;
}

auto tag = 1;

world.send(msg_sent, other, tag);
world.recv(msg_recv, other, tag);

std::cout << "P" << rank << " " << msg_sent << " " << msg_recv << std::endl;
```

There should be no deadlock problem as the messages are quite small. In the case of larger messages it is more appropriate to use non-blocking communications.

## Wrapping up

I have write GitHub Actions to test the code on push and pull request. There is more to do, including writing tests and future developments are listed in the [roadmap](https://github.com/kennethassogba/human.mpi#roadmap).
