<!--
title: Developing cmake2graph
slug: notes/cmake2graph
date: 2025-03-27
description: CMake Dependency Visualization.
categories: CMake
-->

# CMake target dependencies

I built `cmake2graph` to see the dependencies between targets in a CMake project. It reads the CMake files and draws a directed graph, so I can inspect the relationships without following them across files.

## Why I built it

In large C++ codebases, I often had trouble seeing which targets depended on each other. Circular dependencies caused build issues, and complex CMake files made unnecessary dependencies hard to spot.

## How it works

`cmake2graph` is a Python tool that:

1. Parses CMake files recursively
2. Extracts target dependencies
3. Builds a directed graph
4. Visualizes the relationships
5. Provides filtering options

To generate a graph:

```bash
cmake2graph /path/to/project --output deps.png
```

## Implementation

A custom parser extracts dependencies from the CMake files. I use NetworkX to build and manipulate the graph, and Matplotlib to draw it.

### Graph options

The parser handles nested CMake files. You can filter the graph to specific targets, limit the depth of dependency chains, and export it as PNG, SVG, or PDF. Filtering out external libraries is still unfinished.

## What needs work

CMake's flexibility makes parsing difficult. The graph layout also needs to stay readable as projects grow, and processing large projects requires optimization. I want to improve those parts while keeping the tool simple to use.

## Planned work

These features are planned:

### Link errors

I want the tool to:

- Analyze linking errors
- Suggest missing dependencies
- Automatically fix common linking issues

```cmake
# Before: Link error
target_link_libraries(app core)

# After: Automatically fixed
target_link_libraries(app
    PRIVATE
        core
        missing_dependency
)
```

### CMake file cleanup

Future versions could:

- Detect unused targets
- Remove redundant dependencies
- Standardize CMake syntax
- Enforce modern CMake practices

### Dependency analysis

I plan to add:

- Cycle detection and breaking
- Dependency impact analysis
- Build time optimization suggestions
- Target visibility recommendations

### Integrations

I would also like to connect it to:

- IDE plugins
- CI/CD pipelines
- Build systems
- Static analyzers

## Contributing

The code is open source. Contributions could help with:

- CMake parsing improvements
- Graph visualization enhancements
- Documentation
- Test coverage
- New feature implementation

## Current scope

`cmake2graph` draws target dependencies. The dependency-management features above are planned work.

## Links

- [GitHub Repository](https://github.com/kennethassogba/cmake2graph)
- [PyPI Package](https://pypi.org/project/cmake2graph)
