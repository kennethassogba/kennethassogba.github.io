<!--
title: Write a header-only object oriented interface around MPI
slug: notes/write-interface-mpi
date: 2023-05-07
description: Write interface around MPI.
categories: C++, MPI
-->

I wrote [human.mpi](https://github.com/kennethassogba/human.mpi), a header-only C++ interface around MPI.

MPI, the Message Passing Interface, is a standard for writing distributed parallel programs. Scientific computing codes use it to communicate between processes, including when adapting existing software to distributed architectures.

## Problem

Adding MPI calls to existing simulation code can make it harder to read and maintain: the communication code gets mixed with the physics or mathematics. Wrapping the MPI functions in a class keeps those details behind an interface. Boost::MPI takes this approach.

## Proposal

My wrapper is header-only, so it can be included in an existing project. It handles some of the MPI details behind shorter calls. The interface stays the same across underlying MPI implementations, which helps when porting a program to another platform or environment.

## A simple broadcast example

```cpp
#include <string>
#include <iostream>
#include "human/mpi.hpp"

int main() {

 human::mpi::communicator world();
 auto rank = world.rank();
 auto size = world.size();
 auto root = world.root();
 std::cout << "Process " << rank << "/" << size << std::endl;

 std::string msg;
 if (rank == root) msg = "Hello";

 world.bcast(msg);
 std::cout << "Process" << rank << " " << msg << std::endl;

 return 0;
}
```

Here, `msg` is sent from the root process (0 by default) to all other processes. The wrapper first broadcasts the size, so the receiving processes can resize `msg`, then broadcasts the contents of `msg`. When the `communicator` instance goes out of scope, for example at the end of `main`, its destructor finalizes MPI.

Using MPI directly, the equivalent is:

```cpp
#include <string>
#include <iostream>
#include <mpi.h>

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

 int msg_size = msg.size();

 MPI_Bcast(&msg_size, 1, MPI_INT, root, MPI_COMM_WORLD);

 if (rank != root) msg.resize(msg_size);

 MPI_Bcast(const_cast<char*>(msg.c_str()), msg_size, MPI_BYTE, root, MPI_COMM_WORLD);

 std::cout << "Process" << rank << " " << msg << std::endl;

 MPI_Finalize();
 return 0;
}
```

The wrapper replaces at least 4 lines with `world.bcast(msg)`.

## A simple point-to-point communication

This example uses `send` to exchange messages between two processes:

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

With these small messages, I would not expect a deadlock. For larger messages, non-blocking communication is more appropriate.

## Tests and planned work

GitHub Actions runs the tests on pushes and pull requests. More tests and other planned work are listed in the [roadmap](https://github.com/kennethassogba/human.mpi#roadmap).
