import { CurriculumMap, SemesterBlueprint } from './careerCurriculums';

// ==========================================
// 7. SOFTWARE ENGINEER (SYSTEMS & CORE ALGORITHMS)
// ==========================================
export const SOFTWARE_ENG_CURRICULUM: CurriculumMap = {
  1: {
    theme: 'Semester 1 — Computational Thinking, C++ Foundations & Discrete Mathematics',
    focusSummary: 'Build rock-solid low-level algorithmic habits, pointers, memory models, and formal mathematical logic.',
    coreSubject: {
      title: 'Discrete Mathematics, Propositional Logic & Graph Theory',
      description: 'Set theory, boolean algebra, induction proofs, combinatorics, recurrence relations, and graph structures.',
      resources: [
        { title: 'MIT OpenCourseWare: Mathematics for Computer Science', url: 'https://ocw.mit.edu', isFree: true },
        { title: 'NPTEL Official: Discrete Mathematics', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Master mathematical induction and recurrence relations solving (Master Theorem)',
        'Formulate logic proofs and truth tables for digital logic synthesis',
        'Study graph representations (adjacency lists, matrices) and Eulerian paths',
      ],
    },
    skill: {
      title: 'Modern C++ (C++20), Pointer Arithmetic & Memory Models',
      description: 'Stack vs heap allocation, RAII, smart pointers (unique_ptr, shared_ptr), move semantics, and templates.',
      resources: [
        { title: 'learncpp.com: Free Comprehensive C++ Tutorials', url: 'https://www.learncpp.com', isFree: true },
      ],
      actionChecklist: [
        'Implement dynamic arrays and linked structures with raw pointers and valgrind audits',
        'Refactor raw pointer codebases using modern C++ RAII and smart pointers',
        'Solve 40 basic computational problems in C++ without standard library collections',
      ],
    },
    project: {
      title: 'Custom High-Performance Memory Allocator & Data Buffer CLI',
      description: 'Write a custom memory pool and arena allocator in C++ demonstrating zero memory fragmentation and fast block reuse.',
      resources: [
        { title: 'Embedded C++ Systems Guides', url: 'https://isocpp.org', isFree: true },
      ],
      actionChecklist: [
        'Implement fixed-size block memory pool with free-list tracking',
        'Benchmark allocation throughput against default malloc/free (measuring 2x speedup)',
        'Verify zero memory leaks using Valgrind and AddressSanitizer (ASan)',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'HackerRank C++ Gold Badge & NPTEL Discrete Mathematics',
      description: 'Earn top-tier problem solving badge in C++ and pass accredited mathematics examination.',
      resources: [
        { title: 'HackerRank C++ Track', url: 'https://www.hackerrank.com', isFree: true },
      ],
      actionChecklist: [
        'Earn 5-star Gold problem solving badge in C++ on HackerRank',
      ],
    },
  },
  2: {
    theme: 'Semester 2 — Data Structures & Algorithmic Complexity Mastery',
    focusSummary: 'Master tree traversals, balanced BSTs, graph algorithms (Dijkstra, Tarjan), and dynamic programming.',
    coreSubject: {
      title: 'Data Structures & Asymptotic Computational Complexity',
      description: 'Self-balancing trees (AVL, Red-Black), Heaps, Disjoint Set Union (DSU), Trie, Segment Trees, and amortized complexity.',
      resources: [
        { title: 'Introduction to Algorithms (CLRS)', url: 'https://mitpress.mit.edu', isFree: false },
        { title: 'NPTEL: Data Structures and Algorithms', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Implement AVL Tree rotations and verify logarithmic search depth',
        'Analyze amortized complexity of dynamic array doubling and Fibonacci heap operations',
        'Solve recurring competitive programming graph problems (Tarjan’s SCC, Kruskal’s MST)',
      ],
    },
    skill: {
      title: 'Graph Algorithms, Advanced Dynamic Programming & Disjoint Sets',
      description: 'Dijkstra, Bellman-Ford, Floyd-Warshall, Topological Sort, Bitmask DP, and Range Query data structures.',
      resources: [
        { title: 'CP-Algorithms Guide', url: 'https://cp-algorithms.com', isFree: true },
        { title: 'NeetCode 150 Algorithms', url: 'https://neetcode.io', isFree: true },
      ],
      actionChecklist: [
        'Implement Dijkstra and A* shortest path algorithms with priority queues',
        'Solve 50 Dynamic Programming problems on LeetCode (Knapsack, LCS, Matrix Chain)',
        'Build Segment Tree supporting point updates and range sum queries in O(log N)',
      ],
    },
    project: {
      title: 'Algorithmic Graph Routing & Network Flow Simulation Engine',
      description: 'Develop an interactive simulation engine modeling city transit traffic flows using min-cost max-flow (Edmonds-Karp).',
      resources: [
        { title: 'OpenStreetMap Graph Data API', url: 'https://www.openstreetmap.org', isFree: true },
      ],
      actionChecklist: [
        'Parse real-world OpenStreetMap road network data into graph adjacency models',
        'Compute multi-stop transit routes comparing Dijkstra vs Bidirectional A*',
        'Simulate bottleneck traffic congestion using Ford-Fulkerson maximum network flow',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: '100 LeetCode Problems Solved Milestone (Medium / Hard Focus)',
      description: 'Reach 100 solved problems on LeetCode with strong focus on Trees, Graphs, and Dynamic Programming.',
      resources: [
        { title: 'LeetCode Problem Sets', url: 'https://leetcode.com', isFree: true },
      ],
      actionChecklist: [
        'Reach 100 solved problems on LeetCode (minimum 60 Medium, 15 Hard)',
      ],
    },
  },
  3: {
    theme: 'Semester 3 — Computer Organization & Architecture',
    focusSummary: 'Understand instruction set architectures (RISC-V/x86), CPU pipelines, cache hierarchies, and assembly.',
    coreSubject: {
      title: 'Computer Organization, Instruction Sets & Memory Hierarchy',
      description: 'Von Neumann vs Harvard architecture, RISC vs CISC, pipeline hazards (data, control, structural), branch prediction, and cache coherence (MESI).',
      resources: [
        { title: 'Computer Organization and Design (Patterson & Hennessy)', url: 'https://www.elsevier.com', isFree: false },
        { title: 'NPTEL: Computer Architecture (IIT Delhi)', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Calculate CPI (Cycles Per Instruction) and CPU execution time across pipeline stalls',
        'Analyze L1, L2, and L3 cache miss penalties, direct-mapped vs set-associative caches',
        'Understand branch target buffers and 2-bit saturating branch predictors',
      ],
    },
    skill: {
      title: 'Assembly Language (RISC-V / x86-64) & Architecture Simulation',
      description: 'Write assembly subroutines, manage register calling conventions (System V AMD64), stack frames, and CPU simulators (RARS/Mars).',
      resources: [
        { title: 'RISC-V Reader (Free Digital Edition)', url: 'http://www.riscvbook.com', isFree: true },
      ],
      actionChecklist: [
        'Write RISC-V assembly routines for string manipulation and recursive Fibonacci',
        'Inspect compiled binary disassembly using objdump and GDB registers view',
        'Simulate instruction execution cycles and cache hit/miss rates in hardware simulator',
      ],
    },
    project: {
      title: 'Instruction-Cycle Accurate 32-bit RISC-V CPU Emulator in C++',
      description: 'Build an emulator in C++ implementing the RISC-V RV32I base integer instruction set with register file and memory bus.',
      resources: [
        { title: 'RISC-V Specifications', url: 'https://riscv.org/technical/specifications', isFree: true },
      ],
      actionChecklist: [
        'Implement instruction fetch, decode, execute, memory, and writeback cycle states',
        'Support all RV32I instructions: arithmetic, logical, branching, loads, and stores',
        'Execute compiled C programs on the emulator verifying correct terminal output',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'NPTEL Computer Organization and Architecture Accreditation',
      description: 'Appear for the national proctored NPTEL exam in Computer Architecture.',
      resources: [
        { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Score Elite status on the official NPTEL Computer Architecture proctored exam',
      ],
    },
  },
  4: {
    theme: 'Semester 4 — Operating Systems & Concurrency Engineering',
    focusSummary: 'Master process scheduling, virtual memory, POSIX threads, synchronization primitives, and deadlocks.',
    coreSubject: {
      title: 'Operating Systems Principles, Virtual Memory & Kernel Design',
      description: 'Context switching, scheduling algorithms (CFS, Round Robin), page tables, TLB, demand paging, race conditions, semaphores, and condition variables.',
      resources: [
        { title: 'Operating Systems: Three Easy Pieces (OSTEP - Free Online)', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP', isFree: true },
        { title: 'NPTEL: Operating Systems (IIT Madras)', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Trace multi-level page table lookups and page fault handling routines',
        'Prove deadlock freedom using Coffman conditions and Banker’s algorithm',
        'Analyze Linux Completely Fair Scheduler (CFS) red-black tree mechanisms',
      ],
    },
    skill: {
      title: 'POSIX Multithreading (pthreads), Mutexes & Concurrency Primitives',
      description: 'Write concurrent multi-threaded programs using pthreads/C++ std::jthread, mutexes, condition variables, reader-writer locks, and atomic operations.',
      resources: [
        { title: 'C++ Concurrency in Action (Anthony Williams)', url: 'https://www.manning.com', isFree: false },
      ],
      actionChecklist: [
        'Implement producer-consumer problem using bounded buffers and condition variables',
        'Eliminate data races using std::atomic and compare-and-swap (CAS) lock-free techniques',
        'Detect thread race conditions and deadlocks using ThreadSanitizer (TSan)',
      ],
    },
    project: {
      title: 'Multithreaded Concurrent Key-Value Store with Write-Ahead Logging',
      description: 'Architect a thread-safe in-memory key-value database in C++ with lock striping, snapshot isolation, and disk persistence.',
      resources: [
        { title: 'Database Internals Architecture Guides', url: 'https://www.databass.dev', isFree: true },
      ],
      actionChecklist: [
        'Implement concurrent hash table with striped read-write locks for high concurrency',
        'Append mutations to an append-only write-ahead log (WAL) for crash recovery',
        'Benchmark throughput achieving 100,000+ operations/second under multi-core stress',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Swayam Operating Systems Examination Honors',
      description: 'Pass the accredited Swayam examination in Operating Systems.',
      resources: [
        { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Pass proctored examination with distinction certificate',
      ],
    },
  },
  5: {
    theme: 'Semester 5 — Database Internals & Storage Engine Engineering',
    focusSummary: 'Explore B+ Trees, LSM Trees, buffer pool managers, transaction ACID isolation, and write-ahead logs.',
    coreSubject: {
      title: 'Database System Internals & Query Execution Engines',
      description: 'Disk-oriented storage, buffer pool management, B+ Tree index operations, concurrency control (2PL, MVCC), and ARIES crash recovery.',
      resources: [
        { title: 'Carnegie Mellon University: CMU 15-445 Database Systems (Andy Pavlo)', url: 'https://15445.courses.cs.cmu.edu', isFree: true },
      ],
      actionChecklist: [
        'Trace B+ Tree node splitting, borrowing, and leaf page merging operations',
        'Understand Multi-Version Concurrency Control (MVCC) and snapshot isolation anomalies',
        'Analyze WAL physiological logging, checkpointing, and ARIES recovery phases',
      ],
    },
    skill: {
      title: 'Storage Engine Architecture, B+ Trees & Disk Page Serialization',
      description: 'Implement page binary layouts, slotted-page architectures, LRU-K buffer replacement policies, and iterator query execution in C++.',
      resources: [
        { title: 'SQLite Architecture Documentation', url: 'https://www.sqlite.org/arch.html', isFree: true },
      ],
      actionChecklist: [
        'Write binary page serializer writing records to 4KB aligned disk pages',
        'Implement buffer pool manager caching disk pages with LRU eviction',
        'Build B+ Tree index supporting concurrent point lookups and range scans',
      ],
    },
    project: {
      title: 'Lightweight Relational Storage Engine with SQL Parser in C++',
      description: 'Build a disk-backed database storage engine executing basic SELECT, INSERT, and UPDATE queries through a modular SQL parser.',
      resources: [
        { title: 'CMU Bustub Database Project', url: 'https://github.com/cmu-db/bustub', isFree: true },
      ],
      actionChecklist: [
        'Parse basic SQL statements into abstract syntax trees (AST)',
        'Execute sequential scans and B+ Tree index scans over persistent table pages',
        'Validate transactional durability by recovering uncorrupted state after simulated kill -9',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: '200 LeetCode Problems Solved Milestone',
      description: 'Reach 200 solved competitive algorithmic and systems problems on LeetCode.',
      resources: [
        { title: 'LeetCode Top Interview 150', url: 'https://leetcode.com', isFree: true },
      ],
      actionChecklist: [
        'Cross 200 LeetCode problems milestone with focus on hard concurrency and tree problems',
      ],
    },
  },
  6: {
    theme: 'Semester 6 — Computer Networks, Sockets & Distributed Systems',
    focusSummary: 'Master TCP/IP stack internals, socket programming, distributed consensus (Raft/Paxos), and RPCs.',
    coreSubject: {
      title: 'Distributed Systems, Consensus Protocols & Network Programming',
      description: 'CAP Theorem, PACELC, distributed clocks (Lamport, Vector), Raft consensus protocol, RPC semantics, and socket multiplexing (epoll/kqueue).',
      resources: [
        { title: 'MIT 6.824: Distributed Systems (Robert Morris)', url: 'https://pdos.csail.mit.edu/6.824', isFree: true },
        { title: 'Designing Data-Intensive Applications (Martin Kleppmann)', url: 'https://dataintensive.net', isFree: false },
      ],
      actionChecklist: [
        'Analyze leader election, log replication, and safety guarantees in Raft consensus',
        'Compare non-blocking I/O multiplexing (epoll) vs thread-per-connection architectures',
        'Understand split-brain scenarios and quorum write/read equations (R + W > N)',
      ],
    },
    skill: {
      title: 'Low-Level Socket Programming (epoll), gRPC & Protocol Buffers',
      description: 'Build high-performance non-blocking network servers in C++/Go using Linux epoll, Protocol Buffers binary serialization, and gRPC services.',
      resources: [
        { title: 'Beej’s Guide to Network Programming (Free)', url: 'https://beej.us/guide/bgnet', isFree: true },
        { title: 'gRPC Official Documentation', url: 'https://grpc.io/docs', isFree: true },
      ],
      actionChecklist: [
        'Build single-threaded non-blocking HTTP server handling 10,000 concurrent sockets with epoll',
        'Define gRPC service contracts using Protocol Buffers with streaming RPCs',
        'Benchmark binary protobuf throughput against JSON payloads demonstrating 5x bandwidth savings',
      ],
    },
    project: {
      title: 'Distributed Raft Consensus Cluster with Replicated State Machine',
      description: 'Implement a working distributed consensus cluster in C++ or Go supporting leader election, log replication, and partition healing.',
      resources: [
        { title: 'The Raft Consensus Algorithm', url: 'https://raft.github.io', isFree: true },
      ],
      actionChecklist: [
        'Implement Raft heartbeat timers, RequestVote, and AppendEntries RPC handlers',
        'Simulate network partitions demonstrating cluster consensus preservation on majority partition',
        'Build replicated key-value state machine maintaining linearizable consistency',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'NPTEL Distributed Systems Certificate / AWS Solutions Architect',
      description: 'Earn accredited distributed systems and cloud architecture credentials.',
      resources: [
        { title: 'NPTEL Distributed Systems Portal', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Complete proctored examination in Distributed Systems with distinction',
      ],
    },
  },
  7: {
    theme: 'Semester 7 — High-Throughput System Design & Systems Internship',
    focusSummary: 'Solve large-scale system design problems, optimize cache line alignment, and complete systems internship.',
    coreSubject: {
      title: 'High-Throughput Low-Latency System Design & Concurrency Patterns',
      description: 'LMAX Disruptor ring buffers, cache line false sharing, zero-copy networking (sendfile), memory mapping (mmap), and scalable architectures.',
      resources: [
        { title: 'System Design Primer (Donne Martin)', url: 'https://github.com/donnemartin/system-design-primer', isFree: true },
        { title: 'High Performance Browser Networking (Ilya Grigorik)', url: 'https://hpbn.co', isFree: true },
      ],
      actionChecklist: [
        'Eliminate CPU cache line false sharing using alignas(64) memory alignment',
        'Design distributed rate limiter (Token Bucket / Sliding Window) with sub-millisecond latencies',
        'Solve large-scale system design interview scenarios (Twitter Feed, Distributed Cache, Uber Geohashing)',
      ],
    },
    skill: {
      title: 'Profiling with perf, Cache Miss Optimization & Mock Technical Interviews',
      description: 'Profile Linux binaries with perf and flamegraphs, optimize instruction cache miss rates, and conduct peer technical interviews.',
      resources: [
        { title: 'Brendan Gregg’s Linux Performance & FlameGraphs', url: 'https://www.brendangregg.com/flamegraphs.html', isFree: true },
        { title: 'Pramp Free Peer Mock Interviews', url: 'https://www.pramp.com', isFree: true },
      ],
      actionChecklist: [
        'Generate Linux perf flamegraphs identifying CPU instruction bottleneck hot-spots',
        'Conduct 10 peer mock technical coding interviews on Pramp and LeetCode Mock',
        'Optimize memory layout of core structs to maximize CPU data prefetching',
      ],
    },
    project: {
      title: 'Pre-Capstone: High-Performance Distributed Message Broker (Kafka clone)',
      description: 'Build a distributed commit-log message broker with partitioned topics, sequential zero-copy disk writes, and consumer group tracking.',
      resources: [
        { title: 'Apache Kafka Architecture Design Papers', url: 'https://kafka.apache.org/documentation', isFree: true },
      ],
      actionChecklist: [
        'Implement append-only commit log with segment files and index binary files',
        'Leverage Linux sendfile zero-copy system call to stream log segments directly to network sockets',
        'Benchmark sustained ingestion throughput achieving 250,000+ messages/second',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'AICTE / Top-Tier Systems Engineering Summer Internship',
      description: 'Complete an 8-12 week supervised industry internship in systems engineering or backend infrastructure.',
      resources: [
        { title: 'AICTE Internship Portal', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Complete 8-12 weeks systems software engineering internship with signed enterprise appraisal',
      ],
    },
  },
  8: {
    theme: 'Semester 8 — Enterprise Systems Capstone & Placement Drives',
    focusSummary: 'Deliver a battle-tested distributed systems capstone and clear top software engineering placement rounds.',
    coreSubject: {
      title: 'Software Engineering Rigor, Formal Verification & Threat Modeling',
      description: 'Formal verification concepts (TLA+), fuzz testing methodologies (AFL, libFuzzer), software release management, and engineering ethics.',
      resources: [
        { title: 'Practical TLA+ (Hillel Wayne)', url: 'https://learntla.com', isFree: true },
        { title: 'Google Testing Blog Archives', url: 'https://testing.googleblog.com', isFree: true },
      ],
      actionChecklist: [
        'Write TLA+ specification proving safety invariants of a distributed lock algorithm',
        'Fuzz binary interfaces using libFuzzer uncovering edge case memory corruptions',
        'Establish automated release gating with semantic versioning and changelogs',
      ],
    },
    skill: {
      title: 'Fuzz Testing, Memory Sanitizers (ASan/TSan) & Benchmarking',
      description: 'Automate Google Benchmark suites, run continuous AddressSanitizer and LeakSanitizer checks, and deliver technical defense.',
      resources: [
        { title: 'Google Benchmark Library Documentation', url: 'https://github.com/google/benchmark', isFree: true },
      ],
      actionChecklist: [
        'Set up automated Google Benchmark micro-benchmarks in continuous integration',
        'Verify clean AddressSanitizer and UndefinedBehaviorSanitizer pass across all tests',
        'Produce comprehensive technical architecture whitepaper for capstone presentation',
      ],
    },
    project: {
      title: 'Major Capstone: Fault-Tolerant Distributed In-Memory Database Engine',
      description: 'Definitive computer science capstone: a distributed, multi-threaded, in-memory key-value database with Raft consensus and AOF persistence.',
      resources: [
        { title: 'AICTE National Student Project Scheme', url: 'https://www.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Deliver complete multi-node cluster supporting dynamic node join/leave and automatic failover',
        'Demonstrate linearizable consistency under chaotic network partitions and node terminations',
        'Present project to academic defense panel and tech enterprise recruiters',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'Campus Tech Placement Drives & AICTE National Career Launch',
      description: 'Clear campus technical placement rounds for Software Engineer, Systems Engineer, and Core Developer roles.',
      resources: [
        { title: 'National Career Service Portal', url: 'https://www.ncs.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Clear technical coding, systems architecture, and managerial interview rounds',
        'Finalize full-time employment offer in top-tier technology enterprise',
      ],
    },
  },
};

// ==========================================
// 8. DATA SCIENTIST CURRICULUM
// ==========================================
export const DATA_SCIENCE_CURRICULUM: CurriculumMap = {
  1: {
    theme: 'Semester 1 — Mathematical Foundations & Python for Data Science',
    focusSummary: 'Master Linear Algebra, Multivariable Calculus, and idiomatic data analysis in Python.',
    coreSubject: {
      title: 'Linear Algebra & Calculus for Data Science',
      description: 'Vector spaces, matrix decomposition, eigenvalues, gradients, and multivariable functions for statistical modeling.',
      resources: [
        { title: 'MIT OpenCourseWare: Mathematics for Computer Science', url: 'https://ocw.mit.edu', isFree: true },
        { title: '3Blue1Brown: Essence of Linear Algebra', url: 'https://www.3blue1brown.com', isFree: true },
      ],
      actionChecklist: [
        'Understand matrix dot products, projections, and eigenvalues',
        'Compute gradients and partial derivatives of loss functions',
        'Solve 30 computational math challenges using NumPy',
      ],
    },
    skill: {
      title: 'Python, NumPy & Vectorized Computation',
      description: 'Master vectorized array processing, broadcasting, slicing, and memory layouts in NumPy.',
      resources: [
        { title: 'NumPy Official User Guide', url: 'https://numpy.org/doc', isFree: true },
      ],
      actionChecklist: [
        'Write high-performance vectorized operations without Python loops',
        'Manipulate multi-dimensional arrays and matrix transformations',
        'Clean tabular arrays and generate synthetic data distributions',
      ],
    },
    project: {
      title: 'Statistical Matrix Calculator & Vector Geometry Engine',
      description: 'Build a Python module implementing matrix factorizations, statistical distributions, and regression slope calculations.',
      resources: [
        { title: 'SciPy Lectures Notes', url: 'https://scipy-lectures.org', isFree: true },
      ],
      actionChecklist: [
        'Implement ordinary least squares regression from raw matrix equations',
        'Generate 3D vector surface plots with Matplotlib',
        'Publish verified open-source utility package with unit tests',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Kaggle Python Specialist Certification',
      description: 'Earn foundational Python and data handling certification on Kaggle.',
      resources: [
        { title: 'Kaggle Learn Portal', url: 'https://www.kaggle.com/learn', isFree: true },
      ],
      actionChecklist: [
        'Complete Kaggle Python and Data Visualization certifications',
      ],
    },
  },
  2: {
    theme: 'Semester 2 — Applied Probability, Statistics & Data Cleaning',
    focusSummary: 'Master statistical hypothesis testing, confidence intervals, distributions, and cleaning messy data.',
    coreSubject: {
      title: 'Inferential Statistics, Hypothesis Testing & Regression Analysis',
      description: 'Central Limit Theorem, p-values, t-tests, ANOVA, Chi-Square tests, and statistical confidence intervals.',
      resources: [
        { title: 'NPTEL: Probability and Statistics for Data Science', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Formulate null and alternative hypotheses on business data',
        'Calculate two-sample t-tests and Chi-Square contingency tables',
        'Interpret statistical significance and effect sizes accurately',
      ],
    },
    skill: {
      title: 'Pandas Data Cleaning, Outlier Detection & Matplotlib/Seaborn',
      description: 'Handle missing data, remove outliers (IQR/z-scores), merge heterogeneous datasets, and produce statistical plots.',
      resources: [
        { title: 'Pandas Official Documentation', url: 'https://pandas.pydata.org', isFree: true },
      ],
      actionChecklist: [
        'Clean messy multi-source tabular data with imputation strategies',
        'Produce distribution plots, box plots, and heatmaps in Seaborn',
        'Automate data transformation pipelines using Pandas method chaining',
      ],
    },
    project: {
      title: 'Comprehensive Socio-Economic Exploratory Data Analysis & Report',
      description: 'Analyze open national census or economic datasets, discover hidden correlations, and publish an executive data report.',
      resources: [
        { title: 'Data.gov.in Official India Open Data Portal', url: 'https://data.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Clean and analyze 50,000+ socio-economic survey data records',
        'Statistically validate correlations between education and income levels',
        'Publish interactive Streamlit dashboard summarizing analytical findings',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'NPTEL Applied Statistics for Data Science Certificate',
      description: 'Appear for the national proctored NPTEL/Swayam exam in Applied Statistics.',
      resources: [
        { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Pass proctored examination with accredited Elite badge',
      ],
    },
  },
  3: {
    theme: 'Semester 3 — Relational Databases, Advanced SQL & Data Warehousing',
    focusSummary: 'Write advanced SQL queries, window functions, CTEs, and structure star/snowflake schemas.',
    coreSubject: {
      title: 'Relational Database Theory, Normalization & Data Warehousing',
      description: 'Relational algebra, 3NF schema design, dimensional modeling (Star/Snowflake), fact/dimension tables, and indexing.',
      resources: [
        { title: 'NPTEL: Database Management Systems', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Design star schema dimension tables with slowly changing dimensions (SCD)',
        'Optimize complex SQL query execution plans with EXPLAIN ANALYZE',
        'Differentiate OLTP transaction databases vs OLAP analytical warehouses',
      ],
    },
    skill: {
      title: 'Advanced SQL (Window Functions, Aggregations, Indexing) & PostgreSQL',
      description: 'Write window functions (ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD), recursive CTEs, and automated stored procedures.',
      resources: [
        { title: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org', isFree: true },
      ],
      actionChecklist: [
        'Write complex analytical SQL queries calculating rolling 7-day revenue averages',
        'Analyze customer retention cohorts using SQL window functions',
        'Configure database indexes accelerating analytical queries by 10x',
      ],
    },
    project: {
      title: 'Retail Analytics Data Warehouse with Automated ETL Pipeline',
      description: 'Build a multi-source ETL pipeline extracting sales data, transforming with Python, and loading into a PostgreSQL data warehouse.',
      resources: [
        { title: 'Kaggle Retail Store Dataset', url: 'https://www.kaggle.com/datasets', isFree: true },
      ],
      actionChecklist: [
        'Design dimensional model with sales facts and customer/store dimensions',
        'Automate daily ETL data ingestion script with error handling and deduplication',
        'Query analytical metrics answering key executive business revenue questions',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Mode Analytics Advanced SQL Certification',
      description: 'Earn industry-recognized advanced SQL certification.',
      resources: [
        { title: 'Mode SQL Tutorial & Certification', url: 'https://mode.com/sql-tutorial', isFree: true },
      ],
      actionChecklist: [
        'Pass comprehensive advanced SQL challenge and earn verified badge',
      ],
    },
  },
  4: {
    theme: 'Semester 4 — Predictive Modeling & Supervised Machine Learning',
    focusSummary: 'Implement Linear/Logistic Regression, Decision Trees, Random Forests, XGBoost, and evaluate models.',
    coreSubject: {
      title: 'Supervised Learning Theory, Regularization & Bias-Variance Tradeoff',
      description: 'Cost function minimization, regularization (Ridge, Lasso, ElasticNet), ensemble methods (Bagging, Boosting), and evaluation metrics.',
      resources: [
        { title: 'Stanford CS229: Machine Learning', url: 'https://cs229.stanford.edu', isFree: true },
      ],
      actionChecklist: [
        'Derive gradient descent updates for linear and logistic regression models',
        'Analyze bias-variance tradeoff across model complexity curves',
        'Evaluate models with ROC-AUC, precision-recall curves, and F1-score',
      ],
    },
    skill: {
      title: 'Scikit-Learn, XGBoost, LightGBM & Hyperparameter Tuning',
      description: 'Build robust transformation pipelines, encode features, tune hyperparameters with Optuna, and cross-validate.',
      resources: [
        { title: 'XGBoost Official Documentation', url: 'https://xgboost.readthedocs.io', isFree: true },
      ],
      actionChecklist: [
        'Construct leakage-free Scikit-Learn ColumnTransformer pipelines',
        'Train and benchmark XGBoost, LightGBM, and Random Forest models',
        'Tune hyperparameters using Optuna Bayesian optimization',
      ],
    },
    project: {
      title: 'Customer Churn & Lifetime Value Predictive Engine with Feature Store',
      description: 'Develop an end-to-end churn prediction model identifying at-risk customers with probability estimates and SHAP explanations.',
      resources: [
        { title: 'Telco Customer Churn Dataset', url: 'https://www.kaggle.com/datasets', isFree: true },
      ],
      actionChecklist: [
        'Engineer behavioral recency, frequency, and monetary (RFM) features',
        'Achieve 88%+ ROC-AUC on hold-out validation partition',
        'Output individual customer risk scores with feature attribution explanations',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Kaggle Machine Learning Competitions Rank Milestone',
      description: 'Compete in active Kaggle tabular machine learning competitions.',
      resources: [
        { title: 'Kaggle Competitions Hub', url: 'https://www.kaggle.com/competitions', isFree: true },
      ],
      actionChecklist: [
        'Submit competitive predictions to a featured Kaggle tabular competition',
      ],
    },
  },
  5: {
    theme: 'Semester 5 — Unsupervised Learning, Clustering & Time Series Forecasting',
    focusSummary: 'Master K-Means, PCA dimensional reduction, ARIMA/Prophet for time series, and anomaly detection.',
    coreSubject: {
      title: 'Unsupervised Pattern Recognition, Dimensionality Reduction & Time Series',
      description: 'K-Means, DBSCAN, Hierarchical Clustering, PCA, t-SNE, ARIMA, SARIMA, stationarity, and seasonal decompositions.',
      resources: [
        { title: 'Forecasting: Principles and Practice (Rob J Hyndman - Free)', url: 'https://otexts.com/fpp3', isFree: true },
      ],
      actionChecklist: [
        'Determine optimal clusters using Elbow Method and Silhouette Analysis',
        'Verify time series stationarity using Augmented Dickey-Fuller (ADF) tests',
        'Deconstruct time series data into trend, seasonality, and residual noise',
      ],
    },
    skill: {
      title: 'PCA, t-SNE, K-Means Clustering & Facebook Prophet Time Series',
      description: 'Apply dimensionality reduction for visualization, cluster customer segments, and forecast future demand with Prophet.',
      resources: [
        { title: 'Facebook Prophet Documentation', url: 'https://facebook.github.io/prophet', isFree: true },
      ],
      actionChecklist: [
        'Reduce 50+ dimensional data down to 2 components with PCA and t-SNE',
        'Segment customer base into distinct purchasing personas with K-Means',
        'Forecast 90-day future demand curves with 95% confidence intervals in Prophet',
      ],
    },
    project: {
      title: 'Financial Market Anomaly Detection & Demand Forecasting Dashboard',
      description: 'Build an automated time-series forecasting and anomaly detection system flagging unusual transaction spikes and stock deviations.',
      resources: [
        { title: 'Yahoo Finance Free Historical Data API', url: 'https://pypi.org/project/yfinance', isFree: true },
      ],
      actionChecklist: [
        'Ingest and clean multi-year historical financial/retail time series data',
        'Detect statistical outlier spikes using Isolation Forests and Rolling Z-Scores',
        'Deploy interactive forecasting dashboard with historical back-testing accuracy metrics',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'DeepLearning.AI Machine Learning Specialization',
      description: 'Complete the prestigious Machine Learning Specialization by Andrew Ng.',
      resources: [
        { title: 'Coursera ML Specialization', url: 'https://www.coursera.org', isFree: true },
      ],
      actionChecklist: [
        'Earn verified certificate for the complete 3-course Machine Learning Specialization',
      ],
    },
  },
  6: {
    theme: 'Semester 6 — Big Data Engineering & Executive Storytelling',
    focusSummary: 'Process terabyte-scale datasets with PySpark, and communicate insights with PowerBI/Tableau.',
    coreSubject: {
      title: 'Distributed Big Data Architecture (HDFS, Apache Spark, MapReduce)',
      description: 'Resilient Distributed Datasets (RDDs), Spark DataFrames, Catalyst query optimizer, lazy evaluation, and executive visualization principles.',
      resources: [
        { title: 'Spark: The Definitive Guide (Bill Chambers & Matei Zaharia)', url: 'https://www.oreilly.com', isFree: false },
      ],
      actionChecklist: [
        'Understand Spark distributed DAG execution and shuffle partitions',
        'Analyze wide vs narrow transformations and cache persist levels',
        'Master data storytelling techniques and cognitive dashboard design',
      ],
    },
    skill: {
      title: 'PySpark Distributed DataFrames, Spark SQL & Tableau / PowerBI Dashboards',
      description: 'Process large datasets with PySpark, execute distributed Spark SQL queries, and author executive interactive BI dashboards.',
      resources: [
        { title: 'Apache Spark Official Documentation', url: 'https://spark.apache.org/docs/latest', isFree: true },
      ],
      actionChecklist: [
        'Write PySpark scripts performing aggregations on 10M+ row datasets',
        'Design interactive executive KPI dashboard in Tableau or PowerBI',
        'Connect live database data sources to BI dashboards with automated refresh',
      ],
    },
    project: {
      title: 'Distributed Log Analytics Pipeline Processing 10M+ Events in PySpark',
      description: 'Build a distributed big data analytics pipeline aggregating server telemetry, computing conversion funnels, and visualizing KPIs.',
      resources: [
        { title: 'AWS EMR / Databricks Free Community Edition', url: 'https://community.cloud.databricks.com', isFree: true },
      ],
      actionChecklist: [
        'Process multi-gigabyte server log files on distributed Spark cluster',
        'Extract IP geolocations, error spikes, and user funnel drop-offs',
        'Publish interactive PowerBI/Tableau executive dashboard with drill-down filters',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Databricks Certified Associate Data Scientist',
      description: 'Earn enterprise big data and machine learning certification on Databricks/Spark.',
      resources: [
        { title: 'Databricks Certification Portal', url: 'https://www.databricks.com/learn/certification', isFree: true },
      ],
      actionChecklist: [
        'Pass Databricks Certified Associate Data Scientist examination',
      ],
    },
  },
  7: {
    theme: 'Semester 7 — Production ML Deployment & Data Science Internship',
    focusSummary: 'Deploy predictive models as REST APIs (FastAPI), track drift (Evidently AI), and complete internship.',
    coreSubject: {
      title: 'Production Data Science, Model Drift Detection & A/B Testing Statistics',
      description: 'Model deployment architectures, data drift (concept drift vs covariate shift), A/B hypothesis sample sizes, and p-hacking avoidance.',
      resources: [
        { title: 'Designing Machine Learning Systems (Chip Huyen)', url: 'https://www.oreilly.com', isFree: false },
      ],
      actionChecklist: [
        'Calculate minimum sample size and statistical power for enterprise A/B tests',
        'Implement Kolmogorov-Smirnov tests to detect production feature distribution drift',
        'Formulate continuous model monitoring and automated rollback thresholds',
      ],
    },
    skill: {
      title: 'FastAPI Model Endpoints, Streamlit Interactive Apps & Docker',
      description: 'Deploy trained Scikit-Learn/XGBoost models behind FastAPI endpoints, containerize with Docker, and build Streamlit prototypes.',
      resources: [
        { title: 'FastAPI Documentation', url: 'https://fastapi.tiangolo.com', isFree: true },
        { title: 'Streamlit Documentation', url: 'https://streamlit.io', isFree: true },
      ],
      actionChecklist: [
        'Build asynchronous FastAPI endpoint returning predictions in <50ms',
        'Containerize Python ML inference service with lightweight Docker image',
        'Build user-friendly Streamlit interface allowing non-technical users to query models',
      ],
    },
    project: {
      title: 'Pre-Capstone: Interactive Medical Diagnosis Web App with Model Explainability',
      description: 'Deploy an interactive clinical diagnosis prediction application with real-time SHAP waterfall charts explaining individual risk factors.',
      resources: [
        { title: 'SHAP (SHapley Additive exPlanations) Docs', url: 'https://shap.readthedocs.io', isFree: true },
      ],
      actionChecklist: [
        'Deploy trained predictive model with FastAPI and hosted Streamlit UI',
        'Generate instant SHAP force plots explaining why each prediction was made',
        'Audit model for demographic parity and fairness across patient subgroups',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'AICTE / Enterprise Data Science Summer Internship',
      description: 'Complete an 8-12 week supervised industry internship in data science, analytics, or business intelligence.',
      resources: [
        { title: 'AICTE Internship Portal', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Complete 8-12 weeks data science internship with evaluated sign-off',
      ],
    },
  },
  8: {
    theme: 'Semester 8 — End-to-End Enterprise Data Science Capstone',
    focusSummary: 'Deliver a full predictive data science solution with interactive dashboards and enter data science roles.',
    coreSubject: {
      title: 'Data Governance, Algorithmic Fairness & Executive Decision Strategy',
      description: 'Data privacy regulations (DPDP Act, GDPR), algorithmic bias audits, fairness metrics (equal opportunity, disparate impact), and executive presentation.',
      resources: [
        { title: 'Fairness and Machine Learning (Solon Barocas - Free)', url: 'https://fairmlbook.org', isFree: true },
      ],
      actionChecklist: [
        'Audit predictive models for demographic parity across protected demographic classes',
        'Calculate business value and financial ROI delivered by machine learning interventions',
        'Prepare executive slide deck translating complex data science into actionable business recommendations',
      ],
    },
    skill: {
      title: 'SHAP/LIME Model Explainability, Executive Presentation & GitOps',
      description: 'Explain black-box models, present to C-suite stakeholders, automate code testing, and maintain reproducible models.',
      resources: [
        { title: 'Google Data Science Interview Preparation', url: 'https://careers.google.com', isFree: true },
      ],
      actionChecklist: [
        'Deliver compelling 20-minute executive presentation of complex analytical findings',
        'Document model governance cards and data lineage records',
        'Automate end-to-end retraining and validation in GitHub Actions',
      ],
    },
    project: {
      title: 'Major Capstone: End-to-End Predictive Analytics Platform with Automated Retraining',
      description: 'Definitive degree data science capstone featuring automated data ingestion, model training, monitoring, and live executive dashboard.',
      resources: [
        { title: 'AICTE National Student Project Scheme', url: 'https://www.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Deliver complete end-to-end data science platform with live data pipeline',
        'Demonstrate measurable business accuracy improvement over baseline models',
        'Present project defense to university academic panel and visiting corporate recruiters',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'Campus Placement Drives & AICTE National Career Launch',
      description: 'Participate in campus placement drives for Data Scientist, Data Analyst, and ML Associate roles.',
      resources: [
        { title: 'National Career Service Portal', url: 'https://www.ncs.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Clear Data Scientist technical interviews, SQL tests, and case study rounds',
        'Finalize full-time employment offer in data science or analytics organization',
      ],
    },
  },
};

// ==========================================
// 9. MOBILE APP DEVELOPER CURRICULUM
// ==========================================
export const MOBILE_APP_CURRICULUM: CurriculumMap = {
  1: {
    theme: 'Semester 1 — Object-Oriented Programming & Mobile OS Architecture',
    focusSummary: 'Master object-oriented programming paradigms in Dart/Kotlin, memory lifecycles, and mobile OS concepts.',
    coreSubject: {
      title: 'Mobile Operating System Architectures (Android / iOS Lifecycles)',
      description: 'Android activity/fragment lifecycles, iOS view controller lifecycles, memory management (ARC / Garbage Collection), and permissions.',
      resources: [
        { title: 'Android Developer Fundamentals', url: 'https://developer.android.com', isFree: true },
        { title: 'Apple Developer Documentation', url: 'https://developer.apple.com', isFree: true },
      ],
      actionChecklist: [
        'Trace complete Android Activity and Fragment state lifecycles',
        'Understand runtime permission requests and security sandboxing on mobile OS',
        'Analyze memory allocation, heap size limits, and out-of-memory prevention',
      ],
    },
    skill: {
      title: 'Dart / Kotlin Programming Fundamentals, OOP & Asynchronous Streams',
      description: 'Null safety, classes, interfaces, extension functions, coroutines / async-await, and reactive streams.',
      resources: [
        { title: 'Dart Language Tour', url: 'https://dart.dev/guides/language/language-tour', isFree: true },
        { title: 'Kotlin Official Documentation', url: 'https://kotlinlang.org/docs/home.html', isFree: true },
      ],
      actionChecklist: [
        'Write sound null-safe code in Dart/Kotlin with extension functions',
        'Implement asynchronous operations with Futures, Streams, and Coroutines',
        'Solve 30 algorithmic problem sets in Dart or Kotlin',
      ],
    },
    project: {
      title: 'Command-Line Mobile Task Management Engine & Algorithm Suite',
      description: 'Build a modular task management and productivity engine implementing scheduling algorithms and file persistence in Dart/Kotlin.',
      resources: [
        { title: 'Dart CLI Documentation', url: 'https://dart.dev/tutorials/server/cmdline', isFree: true },
      ],
      actionChecklist: [
        'Implement task prioritization, tag filtering, and recurrence logic',
        'Persist user tasks to local JSON and SQLite databases',
        'Write unit tests verifying edge case recurrence and date boundary conditions',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'HackerRank Problem Solving / Kotlin Foundations Badge',
      description: 'Earn verified foundational problem-solving and programming credentials.',
      resources: [
        { title: 'HackerRank Problem Solving', url: 'https://www.hackerrank.com', isFree: true },
      ],
      actionChecklist: [
        'Earn 5-star problem solving badge on HackerRank',
      ],
    },
  },
  2: {
    theme: 'Semester 2 — Mobile UI Design & Widget Hierarchies',
    focusSummary: 'Build pixel-perfect, responsive mobile layouts following Material 3 and Cupertino design guidelines.',
    coreSubject: {
      title: 'Mobile User Interface Guidelines & Touch Event Handling',
      description: 'Material Design 3 specifications, iOS Human Interface Guidelines, touch responder chains, and responsive mobile layouts.',
      resources: [
        { title: 'Material Design 3 Guidelines (Google)', url: 'https://m3.material.io', isFree: true },
        { title: 'Apple Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines', isFree: true },
      ],
      actionChecklist: [
        'Differentiate Material 3 and Cupertino design philosophies',
        'Handle gesture detectors, touch events, and swipe-to-dismiss interactions',
        'Design adaptive layouts supporting diverse screen ratios and foldable displays',
      ],
    },
    skill: {
      title: 'Flutter / React Native Core Widgets, Responsive Layouts & Animations',
      description: 'Stateless/Stateful widgets, CustomScrollView, Slivers, implicit animations, and responsive MediaQuery scaling.',
      resources: [
        { title: 'Flutter Official Documentation', url: 'https://docs.flutter.dev', isFree: true },
        { title: 'React Native Getting Started', url: 'https://reactnative.dev/docs/getting-started', isFree: true },
      ],
      actionChecklist: [
        'Build complex multi-scroll views with CustomScrollView and Slivers',
        'Implement fluid hero transitions and animated containers',
        'Ensure responsive scaling across phones, tablets, and landscape orientations',
      ],
    },
    project: {
      title: 'Fitness & Nutrition Tracker UI with Dynamic Charts & Fluid Animations',
      description: 'Design and build a responsive mobile fitness app UI with activity ring animations, weekly charts, and custom navigation.',
      resources: [
        { title: 'fl_chart Flutter Library', url: 'https://pub.dev/packages/fl_chart', isFree: true },
      ],
      actionChecklist: [
        'Build animated activity progress rings inspired by modern smartwatch interfaces',
        'Render interactive weekly calorie and workout charts with tooltips',
        'Implement dark mode and light mode theme switching with instant persistence',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Google Developers Mobile Web / Flutter Essentials Badge',
      description: 'Earn foundational mobile development credentials from Google Developers.',
      resources: [
        { title: 'Google Developers Certification', url: 'https://developers.google.com', isFree: true },
      ],
      actionChecklist: [
        'Complete Google Developers mobile training pathway badges',
      ],
    },
  },
  3: {
    theme: 'Semester 3 — State Management & Local Data Persistence',
    focusSummary: 'Master predictable state management (Bloc / Provider / Riverpod), SQLite database storage, and caching.',
    coreSubject: {
      title: 'State Management Paradigms (Reactive Programming, Streams, BLoC)',
      description: 'Unidirectional data flow, reactive streams, state immutability, repository pattern, and separation of UI and business logic.',
      resources: [
        { title: 'Bloc State Management Documentation', url: 'https://bloclibrary.dev', isFree: true },
      ],
      actionChecklist: [
        'Compare BLoC, Riverpod, and Provider state management architectural trade-offs',
        'Implement the Repository Pattern separating data sources from application logic',
        'Ensure complete immutability using Equatable or Freezed data classes',
      ],
    },
    skill: {
      title: 'Bloc / Riverpod State Architecture & SQLite / Hive Local Storage',
      description: 'Emit state events, listen to stream state transitions, cache offline data in SQLite (sqflite/Room) or Hive key-value stores.',
      resources: [
        { title: 'pub.dev Flutter Package Repository', url: 'https://pub.dev', isFree: true },
      ],
      actionChecklist: [
        'Structure mobile features into Data, Domain, and Presentation layers',
        'Persist structured relational data with SQLite database tables and migrations',
        'Implement encrypted local storage for sensitive user tokens using flutter_secure_storage',
      ],
    },
    project: {
      title: 'Offline-First Personal Finance & Expense Manager with Encrypted DB',
      description: 'Build an offline-first mobile personal finance tracker featuring transaction categorization, monthly budget limits, and CSV export.',
      resources: [
        { title: 'Sqflite Database Plugin', url: 'https://pub.dev/packages/sqflite', isFree: true },
      ],
      actionChecklist: [
        'Implement complete CRUD operations persisting transactions to local encrypted SQLite',
        'Manage reactive budget states with Bloc emitting instant calculation updates',
        'Export monthly spending summaries to downloadable CSV files',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Meta React Native Specialization / Flutter Certified Track',
      description: 'Earn an accredited cross-platform mobile app development certificate.',
      resources: [
        { title: 'Coursera Meta React Native Track', url: 'https://www.coursera.org', isFree: true },
      ],
      actionChecklist: [
        'Complete Meta React Native or Flutter Certified specialization modules',
      ],
    },
  },
  4: {
    theme: 'Semester 4 — Networking, REST APIs & Firebase Backend Integration',
    focusSummary: 'Connect mobile apps to remote REST/GraphQL services, handle authentication, and integrate Firebase.',
    coreSubject: {
      title: 'Mobile Network Security, SSL Pinning & RESTful API Communication',
      description: 'HTTP client interceptors, token refresh lifecycles, offline request queuing, SSL certificate pinning, and JSON serialization.',
      resources: [
        { title: 'OWASP Mobile Security Guide', url: 'https://owasp.org/www-project-mobile-security', isFree: true },
      ],
      actionChecklist: [
        'Implement HTTP client interceptors injecting Bearer tokens and catching 401s',
        'Enforce SSL Certificate Pinning to prevent man-in-the-middle (MITM) proxy attacks',
        'Queue offline POST requests and automatically replay when connectivity returns',
      ],
    },
    skill: {
      title: 'Dio / Axios HTTP Client, JWT Authentication & Firebase Auth/Firestore',
      description: 'Handle authentication flows, Google Sign-In, Firebase Cloud Firestore real-time listeners, and Firebase Storage.',
      resources: [
        { title: 'Firebase Official Documentation for Flutter/React Native', url: 'https://firebase.google.com/docs', isFree: true },
      ],
      actionChecklist: [
        'Integrate Firebase Authentication with email/password and Google OAuth',
        'Listen to real-time database updates from Cloud Firestore',
        'Upload compressed images to cloud storage with progress indicators',
      ],
    },
    project: {
      title: 'Authenticated Social Marketplace App with Live Image Uploads',
      description: 'Develop a mobile marketplace app where authenticated users browse products, list items with camera photos, and chat.',
      resources: [
        { title: 'Image Picker Plugin', url: 'https://pub.dev/packages/image_picker', isFree: true },
      ],
      actionChecklist: [
        'Implement complete user registration, password reset, and session persistence',
        'Compress user camera photos on-device before uploading to cloud storage',
        'Paginate product catalog feeds using infinite scroll controllers',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Google Associate Android Developer / Firebase Certification',
      description: 'Pass industry mobile developer credential examinations.',
      resources: [
        { title: 'Google Associate Android Developer Portal', url: 'https://developers.google.com/certification/associate-android-developer', isFree: true },
      ],
      actionChecklist: [
        'Pass Google Associate Android Developer certification examination',
      ],
    },
  },
  5: {
    theme: 'Semester 5 — Device Hardware Features & Push Notifications',
    focusSummary: 'Access camera hardware, GPS geolocation, Bluetooth BLE, background services, and Firebase Cloud Messaging.',
    coreSubject: {
      title: 'Mobile Hardware Abstraction Layers & Background Services',
      description: 'Camera sensor pipelines, GPS geofencing, Bluetooth Low Energy (BLE) GATT profiles, background job schedulers, and push notification payloads.',
      resources: [
        { title: 'Android Background Processing Guide', url: 'https://developer.android.com/guide/background', isFree: true },
      ],
      actionChecklist: [
        'Understand battery-efficient background task execution (WorkManager)',
        'Configure foreground services with persistent status bar notification channels',
        'Analyze Bluetooth Low Energy (BLE) peripheral scanning and characteristic reads',
      ],
    },
    skill: {
      title: 'Camera API, Geolocation / Map Integration & Push Notifications (FCM)',
      description: 'Access device GPS, render Google Maps / Mapbox, handle camera QR code scanning, and handle foreground/background push notifications.',
      resources: [
        { title: 'Firebase Cloud Messaging (FCM) Docs', url: 'https://firebase.google.com/docs/cloud-messaging', isFree: true },
      ],
      actionChecklist: [
        'Integrate Google Maps SDK with custom map markers and real-time polyline routes',
        'Build camera-based QR code and barcode scanner with instant validation',
        'Handle background FCM push notifications with deep-linking to specific app screens',
      ],
    },
    project: {
      title: 'Real-Time Courier Tracking & Delivery Dispatch Mobile App',
      description: 'Build a mobile logistics application tracking driver GPS locations in real-time on interactive maps with push notifications.',
      resources: [
        { title: 'Google Maps Flutter Plugin', url: 'https://pub.dev/packages/google_maps_flutter', isFree: true },
      ],
      actionChecklist: [
        'Stream driver GPS coordinates at 5-second intervals to backend server',
        'Render smooth animated driver vehicle marker movements along road polylines',
        'Trigger automated push notifications when delivery courier enters 500m geofence',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'NPTEL Mobile Computing Accredited Examination',
      description: 'Appear for the official proctored NPTEL examination in Mobile Computing.',
      resources: [
        { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Pass proctored examination with Elite certification badge',
      ],
    },
  },
  6: {
    theme: 'Semester 6 — Mobile App Performance Profiling & Automated Testing',
    focusSummary: 'Profile app render frames (60fps target), eliminate memory leaks, and write widget/integration tests.',
    coreSubject: {
      title: 'Mobile Graphics Pipelines, Frame Rendering & Memory Optimization',
      description: 'Skia / Impeller rendering engines, frame budget (16ms per frame), UI thread jank, memory leaks, and automated testing pyramids.',
      resources: [
        { title: 'Flutter Performance Profiling Guide', url: 'https://docs.flutter.dev/perf', isFree: true },
      ],
      actionChecklist: [
        'Analyze CPU and GPU frame render graphs in Flutter DevTools / Android Studio Profiler',
        'Eliminate unnecessary widget rebuilds using const constructors and selector hooks',
        'Track down retained memory leaks and unclosed stream subscriptions',
      ],
    },
    skill: {
      title: 'Flutter DevTools / Android Profiler, Unit Testing & Integration Testing',
      description: 'Write unit tests, widget tests with Mockito, end-to-end integration tests using Patrol/IntegrationTest, and benchmark frame rates.',
      resources: [
        { title: 'Patrol: Advanced Flutter Testing Framework', url: 'https://patrol.leancode.co', isFree: true },
      ],
      actionChecklist: [
        'Achieve 80%+ unit test coverage across business logic repositories and blocs',
        'Write automated widget tests verifying user interaction behaviors',
        'Execute end-to-end integration tests simulating complete user checkout flows',
      ],
    },
    project: {
      title: 'High-Performance Streaming Audio Player with Background Playback',
      description: 'Develop an audio streaming mobile app with smooth 60fps animations, lock screen media controls, and zero frame drops.',
      resources: [
        { title: 'just_audio Flutter Plugin', url: 'https://pub.dev/packages/just_audio', isFree: true },
      ],
      actionChecklist: [
        'Stream high-bitrate audio with native background playback services and lock screen controls',
        'Render 60fps smooth audio waveform visualizations without UI thread stutter',
        'Cache audio segments on local disk for seamless offline playback',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Fastlane CI/CD Automation & Test Automation Badge',
      description: 'Validate mobile DevOps and test automation mastery.',
      resources: [
        { title: 'Fastlane Docs', url: 'https://fastlane.tools', isFree: true },
      ],
      actionChecklist: [
        'Automate test runs and artifact builds in continuous integration pipeline',
      ],
    },
  },
  7: {
    theme: 'Semester 7 — App Store Deployment & Mobile Industry Internship',
    focusSummary: 'Build automated release pipelines (Fastlane), pass App Store review guidelines, and complete mobile internship.',
    coreSubject: {
      title: 'App Store & Play Store Optimization (ASO), Release Signatures & Privacy',
      description: 'Android App Bundles (AAB), keystore signing, Apple App Store review guidelines, In-App Purchases (IAP), and App Store Optimization.',
      resources: [
        { title: 'Google Play Launch Checklist', url: 'https://developer.android.com/distribute/best-practices/launch/launch-checklist', isFree: true },
        { title: 'Apple App Store Review Guidelines', url: 'https://developer.apple.com/app-store/review/guidelines', isFree: true },
      ],
      actionChecklist: [
        'Generate release keystores and configure upload keys securely in CI environments',
        'Comply with Google Play Data Safety and Apple App Privacy nutrition labels',
        'Structure In-App Purchases and subscription receipt verification backends',
      ],
    },
    skill: {
      title: 'Fastlane Deployment Pipelines, Keystore Signing & In-App Purchases',
      description: 'Automate build number increments, screenshot generation, certificate management (match), and uploading to internal test tracks.',
      resources: [
        { title: 'Fastlane Match Code Signing Documentation', url: 'https://docs.fastlane.tools/actions/match', isFree: true },
      ],
      actionChecklist: [
        'Write Fastlane Fastfile automating Android AAB builds and Google Play internal track uploads',
        'Configure GitHub Actions running automated builds and uploading to Firebase App Distribution',
        'Integrate RevenueCat SDK for cross-platform in-app subscriptions',
      ],
    },
    project: {
      title: 'Pre-Capstone: Full-Featured AI-Assisted Language Learning Mobile App',
      description: 'Deliver an interactive language learning mobile app with speech recognition, AI conversational dialogues, and spaced repetition.',
      resources: [
        { title: 'OpenAI Speech-to-Text Whisper API', url: 'https://platform.openai.com', isFree: true },
      ],
      actionChecklist: [
        'Record microphone audio and evaluate pronunciation accuracy via speech API',
        'Implement Leitner Box spaced repetition algorithm for vocabulary retention',
        'Release beta version to 50 active testers via Google Play Internal Testing',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'AICTE / Top Mobile Enterprise Summer Internship',
      description: 'Complete an 8-12 week supervised industry internship in native or cross-platform mobile app development.',
      resources: [
        { title: 'AICTE Internship Portal', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Complete 8-12 weeks mobile app engineering internship with signed enterprise evaluation',
      ],
    },
  },
  8: {
    theme: 'Semester 8 — Production Consumer Mobile App Launch & Placement',
    focusSummary: 'Launch a production app on Google Play Store and Apple App Store, and clear mobile engineering placement rounds.',
    coreSubject: {
      title: 'Mobile App Security, Reverse Engineering Protection & Analytics',
      description: 'ProGuard/R8 code obfuscation, root/jailbreak detection, tamper detection, crash reporting with Crashlytics, and product telemetry.',
      resources: [
        { title: 'Android App Security Best Practices', url: 'https://developer.android.com/privacy-and-security/security-best-practices', isFree: true },
      ],
      actionChecklist: [
        'Configure ProGuard/R8 obfuscation rules preventing reverse engineering of application code',
        'Detect rooted and jailbroken devices preventing execution of high-security banking flows',
        'Analyze crash-free user percentage and breadcrumbs using Firebase Crashlytics',
      ],
    },
    skill: {
      title: 'Crashlytics, Mixpanel Telemetry & Offline Conflict Resolution',
      description: 'Log custom non-fatal exceptions, track user interaction funnels in Mixpanel, and resolve two-way synchronization conflicts.',
      resources: [
        { title: 'Firebase Crashlytics Documentation', url: 'https://firebase.google.com/docs/crashlytics', isFree: true },
      ],
      actionChecklist: [
        'Log custom non-fatal exceptions with device diagnostic keys in Crashlytics',
        'Track complete user onboarding and purchase conversion funnels in Mixpanel',
        'Implement conflict-resolution strategies for concurrent multi-device sync',
      ],
    },
    project: {
      title: 'Major Capstone: Live Published Consumer Mobile App with 1,000+ Active Users',
      description: 'Definitive degree mobile capstone: a production-grade consumer application published live on Google Play Store with real users.',
      resources: [
        { title: 'Google Play Console', url: 'https://play.google.com/console', isFree: true },
        { title: 'AICTE National Student Project Scheme', url: 'https://www.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Publish live application on Google Play Store maintaining 99.5%+ crash-free session rate',
        'Acquire 1,000+ organic downloads with 4.5+ star store rating reviews',
        'Present project to academic defense panel and mobile enterprise recruiters',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'Campus Placement Drives & AICTE National Career Launch',
      description: 'Participate in campus placement drives for Mobile App Developer, Flutter Engineer, and iOS/Android Specialist roles.',
      resources: [
        { title: 'National Career Service Portal', url: 'https://www.ncs.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Clear technical mobile architecture, coding, and live app demonstration interviews',
        'Secure full-time role as Mobile Application Engineer in top product organization',
      ],
    },
  },
};

/**
 * Intelligent dynamic generator for custom or specialized user-entered careers
 * (e.g., Robotics Engineer, Agricultural Specialist, Renewable Energy, etc.)
 */
export function generateDynamicCurriculum(
  goal: string,
  tree: { requiredSkills: string[]; coreSubjects: string[] }
): CurriculumMap {
  const cleanGoal = goal ? goal.trim() : 'Software Engineering';
  const skills = tree.requiredSkills;
  const subjects = tree.coreSubjects;

  const getSkillAt = (idx: number) => skills[idx % skills.length] || `${cleanGoal} Core Skill`;
  const getSubjectAt = (idx: number) => subjects[idx % subjects.length] || `${cleanGoal} Core Subject`;

  return {
    1: {
      theme: `Semester 1 — ${cleanGoal} Foundations & Computational Thinking`,
      focusSummary: `Establish core foundational principles, tools, and theoretical methods essential for ${cleanGoal}.`,
      coreSubject: {
        title: `Foundations of ${getSubjectAt(0)}`,
        description: `Master fundamental principles, core terminology, mathematical models, and foundational literature in ${cleanGoal}.`,
        resources: [
          { title: `NPTEL Official: ${getSubjectAt(0)}`, url: 'https://nptel.ac.in', isFree: true },
          { title: 'MIT OpenCourseWare Foundation Courses', url: 'https://ocw.mit.edu', isFree: true },
        ],
        actionChecklist: [
          `Study introductory modules and core theoretical paradigms of ${cleanGoal}`,
          'Master professional documentation and fundamental domain standards',
          'Solve introductory foundational analytical problem sets',
        ],
      },
      skill: {
        title: `First-Principles Mastery: ${getSkillAt(0)}`,
        description: `Hands-on practical laboratory and tool exercises to build early fluency in ${getSkillAt(0)}.`,
        resources: [
          { title: 'freeCodeCamp & Open Tutorials', url: 'https://www.freecodecamp.org', isFree: true },
          { title: 'Official Documentation & Standards', url: 'https://developer.mozilla.org', isFree: true },
        ],
        actionChecklist: [
          `Complete 20 hands-on practical lab exercises in ${getSkillAt(0)}`,
          'Maintain a structured digital portfolio repository documenting progress',
        ],
      },
      project: {
        title: `Introductory Showcase: ${cleanGoal} Practical Sandbox`,
        description: `Build and publish a working demonstration tool or analytical project proving competency in ${cleanGoal} fundamentals.`,
        resources: [
          { title: 'GitHub Guides & Showcases', url: 'https://github.com', isFree: true },
        ],
        actionChecklist: [
          `Implement initial prototype applying ${getSkillAt(0)} to solve a practical problem`,
          'Publish clean, documented source code or project portfolio on GitHub',
        ],
      },
      careerMilestone: {
        category: 'certification',
        title: `${cleanGoal} Foundation Badge & Swayam Registration`,
        description: `Earn your first verified credential and register for accredited national certification in ${cleanGoal}.`,
        resources: [
          { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
        ],
        actionChecklist: [
          `Enroll in accredited Swayam / NPTEL semester course for ${cleanGoal}`,
          'Earn verified foundational skill badge on official learning platforms',
        ],
      },
    },
    2: {
      theme: `Semester 2 — Data Methods & Practical Tooling in ${cleanGoal}`,
      focusSummary: `Deepen analytical proficiency, master domain-specific tooling, and tackle structured problem sets.`,
      coreSubject: {
        title: `Analytical Methods & ${getSubjectAt(1)}`,
        description: `Explore data representation, algorithmic modeling, and empirical methods in ${getSubjectAt(1)}.`,
        resources: [
          { title: `NPTEL: ${getSubjectAt(1)}`, url: 'https://nptel.ac.in', isFree: true },
        ],
        actionChecklist: [
          `Analyze core computational workflows in ${cleanGoal}`,
          'Evaluate trade-offs and efficiency across domain methods',
        ],
      },
      skill: {
        title: `Applied Techniques: ${getSkillAt(1)}`,
        description: `Build hands-on practical competency in ${getSkillAt(1)} for production and field workflows.`,
        resources: [
          { title: 'Official Domain Guides & Tooling Hub', url: 'https://github.com', isFree: true },
        ],
        actionChecklist: [
          `Implement modular solutions utilizing ${getSkillAt(1)}`,
          'Write reproducible tests and verification scripts',
        ],
      },
      project: {
        title: `${cleanGoal} Data Processing & Simulation Utility`,
        description: `Develop an interactive simulation or processing utility demonstrating real-world problem solving in ${cleanGoal}.`,
        resources: [
          { title: 'Open Source Reference Implementations', url: 'https://github.com', isFree: true },
        ],
        actionChecklist: [
          'Process and clean real-world domain datasets or telemetry',
          'Deploy working prototype with interactive controls and metrics',
        ],
      },
      careerMilestone: {
        category: 'certification',
        title: `Swayam / NPTEL Certification & Skill Assessment`,
        description: `Complete national accredited examination validating core knowledge in ${cleanGoal}.`,
        resources: [
          { title: 'Swayam Examination Portal', url: 'https://swayam.gov.in', isFree: true },
        ],
        actionChecklist: [
          'Pass proctored Swayam semester examination with verified credential',
        ],
      },
    },
    3: {
      theme: `Semester 3 — Systems Architecture & Core Frameworks (${cleanGoal})`,
      focusSummary: `Learn architectural frameworks, data persistence, and connect core modules into structured systems.`,
      coreSubject: {
        title: `Core Systems Architecture in ${cleanGoal}`,
        description: `Deep-dive into system design, relational data structures, and architectural standards governing ${cleanGoal}.`,
        resources: [
          { title: `NPTEL Official: ${getSubjectAt(0)}`, url: 'https://nptel.ac.in', isFree: true },
        ],
        actionChecklist: [
          `Understand structural design patterns specific to ${cleanGoal}`,
          'Evaluate scalability and fault-tolerance constraints',
        ],
      },
      skill: {
        title: `Framework Integration: ${getSkillAt(2)}`,
        description: `Integrate ${getSkillAt(2)} with industry-standard development and analytical frameworks.`,
        resources: [
          { title: 'Developer Documentation Hub', url: 'https://developer.mozilla.org', isFree: true },
        ],
        actionChecklist: [
          `Build production-ready modules incorporating ${getSkillAt(2)}`,
          'Implement automated validation and error recovery',
        ],
      },
      project: {
        title: `${cleanGoal} Operations & Management Workspace`,
        description: `Build a complete management platform featuring data persistence, user authentication, and domain dashboards.`,
        resources: [
          { title: 'GitHub Open Architecture Showcases', url: 'https://github.com', isFree: true },
        ],
        actionChecklist: [
          'Design domain data models and secure API communication',
          'Deploy working platform on cloud hosting with live demonstration',
        ],
      },
      careerMilestone: {
        category: 'certification',
        title: `Industry Foundation Certification in ${cleanGoal}`,
        description: `Earn an accredited domain credential and achieve practical milestones.`,
        resources: [
          { title: 'National Skill Development Portal', url: 'https://www.skillindia.gov.in', isFree: true },
        ],
        actionChecklist: [
          `Earn verified intermediate certification in ${cleanGoal}`,
        ],
      },
    },
    4: {
      theme: `Semester 4 — Advanced Implementation & Practical Engineering`,
      focusSummary: `Master complex system integration, state management, and real-world system building in ${cleanGoal}.`,
      coreSubject: {
        title: `Applied Engineering & Standards: ${getSubjectAt(1)}`,
        description: `Study advanced system constraints, concurrency, protocol standards, and security in ${cleanGoal}.`,
        resources: [
          { title: `NPTEL Official Course: ${getSubjectAt(1)}`, url: 'https://nptel.ac.in', isFree: true },
        ],
        actionChecklist: [
          'Study industry compliance standards and operational safety constraints',
          'Benchmark system latency and performance throughput',
        ],
      },
      skill: {
        title: `Production Workflows: ${getSkillAt(3)}`,
        description: `Implement scalable production-grade pipelines with ${getSkillAt(3)}.`,
        resources: [
          { title: 'Official Documentation & Guides', url: 'https://developer.mozilla.org', isFree: true },
        ],
        actionChecklist: [
          `Write modular services utilizing ${getSkillAt(3)}`,
          'Conduct comprehensive unit and integration testing',
        ],
      },
      project: {
        title: `Citizen & Enterprise Solution (${cleanGoal})`,
        description: `Develop a full-featured solution tailored to practical enterprise or citizen challenges in ${cleanGoal}.`,
        resources: [
          { title: 'Free Cloud Hosting Guide', url: 'https://render.com', isFree: true },
        ],
        actionChecklist: [
          'Implement complete end-to-end user workflows and secure access',
          'Deploy live working demo on reliable cloud infrastructure',
        ],
      },
      careerMilestone: {
        category: 'certification',
        title: `Smart India Hackathon Participation / Domain Certificate`,
        description: `Participate in national AICTE hackathons and earn domain credentials.`,
        resources: [
          { title: 'Smart India Hackathon (SIH) Portal', url: 'https://sih.gov.in', isFree: true },
        ],
        actionChecklist: [
          'Submit hackathon innovation entry in relevant problem statement track',
        ],
      },
    },
    5: {
      theme: `Semester 5 — Scalable Infrastructure & System Integration`,
      focusSummary: `Learn containerization, caching, distributed deployment, and infrastructure scaling in ${cleanGoal}.`,
      coreSubject: {
        title: `Distributed Systems & Scalability in ${cleanGoal}`,
        description: `Explore horizontal scaling, caching strategies, and high-availability operations.`,
        resources: [
          { title: `NPTEL Official: ${getSubjectAt(2)}`, url: 'https://nptel.ac.in', isFree: true },
        ],
        actionChecklist: [
          'Study distributed consensus and horizontal scaling patterns',
          'Design resilience strategies for hardware and network interruptions',
        ],
      },
      skill: {
        title: `Modern Tooling: Containerization & ${getSkillAt(4)}`,
        description: `Containerize applications with Docker and build automated pipelines with ${getSkillAt(4)}.`,
        resources: [
          { title: 'Docker Official Getting Started Hub', url: 'https://docs.docker.com', isFree: true },
        ],
        actionChecklist: [
          'Write multi-stage Dockerfiles and container orchestration manifests',
          `Automate domain pipelines leveraging ${getSkillAt(4)}`,
        ],
      },
      project: {
        title: `Real-Time Platform & Distributed Operations (${cleanGoal})`,
        description: `Build a real-time collaborative or telemetry processing platform tailored to ${cleanGoal} requirements.`,
        resources: [
          { title: 'Docker Hub & Architecture Guides', url: 'https://hub.docker.com', isFree: true },
        ],
        actionChecklist: [
          'Implement real-time pub/sub synchronization and event broadcasting',
          'Deploy fully containerized multi-container environment with health monitoring',
        ],
      },
      careerMilestone: {
        category: 'certification',
        title: `Accredited Cloud / Domain Credential`,
        description: `Validate professional systems and infrastructure skills through verified certifications.`,
        resources: [
          { title: 'AICTE Smart India Hackathon', url: 'https://sih.gov.in', isFree: true },
        ],
        actionChecklist: [
          `Clear accredited associate credential aligned with ${cleanGoal}`,
        ],
      },
    },
    6: {
      theme: `Semester 6 — Automation, CI/CD & Advanced Domain Specialization`,
      focusSummary: `Automate pipelines, master cloud architecture, performance optimization, and prepare for industry interviews.`,
      coreSubject: {
        title: `Advanced System Architecture & Optimization in ${cleanGoal}`,
        description: `Master high-throughput, low-latency architectures, observability, and reliability metrics.`,
        resources: [
          { title: 'Google SRE Book (Free Online)', url: 'https://sre.google/sre-book/table-of-contents', isFree: true },
        ],
        actionChecklist: [
          'Formulate SLO/SLA reliability targets and alert thresholds',
          'Benchmark system performance under simulated heavy loads',
        ],
      },
      skill: {
        title: `CI/CD Automation & Advanced ${cleanGoal} Tooling`,
        description: `Implement GitHub Actions pipelines with linting, automated testing, container deployment, and monitoring.`,
        resources: [
          { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', isFree: true },
        ],
        actionChecklist: [
          'Set up automated continuous integration and continuous deployment pipelines',
          'Configure metrics collection and automated alerts',
        ],
      },
      project: {
        title: `Production System with Automated CI/CD & Monitoring (${cleanGoal})`,
        description: `Deploy a production multi-tenant or enterprise application featuring automated CI/CD and observability.`,
        resources: [
          { title: 'Grafana & Prometheus Monitoring Guide', url: 'https://grafana.com', isFree: true },
        ],
        actionChecklist: [
          'Automate zero-downtime deployment pipelines with rollback safety',
          'Monitor real-time error rates and latency telemetry on live dashboards',
        ],
      },
      careerMilestone: {
        category: 'certification',
        title: `Associate Cloud / Domain Specialty Examination`,
        description: `Clear an industry-recognized associate examination and prepare your technical portfolio for placements.`,
        resources: [
          { title: 'AICTE Internship Portal Registration', url: 'https://internship.aicte-india.org', isFree: true },
        ],
        actionChecklist: [
          `Pass industry-standard certification aligned with ${cleanGoal}`,
          'Register on the official AICTE Internship Portal',
        ],
      },
    },
    7: {
      theme: `Semester 7 — Industry Internship & Placement Mastery (${cleanGoal})`,
      focusSummary: `Gain real industry experience, solve production-grade problems, and excel in technical and behavioral interviews.`,
      coreSubject: {
        title: `Technical Interview Mastery & Domain Problem Solving`,
        description: `Systematic interview preparation covering scalable system architecture, concurrency, and 150 top technical problems.`,
        resources: [
          { title: 'Tech Interview Handbook (Free)', url: 'https://www.techinterviewhandbook.org', isFree: true },
        ],
        actionChecklist: [
          'Solve top technical interview problems under timed conditions',
          'Practice system design and architecture whiteboarding challenges',
        ],
      },
      skill: {
        title: `Production Code Optimization & Mock Technical Interviews`,
        description: `Master profiling, memory leak detection, database query indexing, and participate in peer mock interviews.`,
        resources: [
          { title: 'Pramp Free Peer Mock Interviews', url: 'https://www.pramp.com', isFree: true },
        ],
        actionChecklist: [
          'Complete 10 peer mock technical interviews with evaluated feedback',
          'Profile performance bottlenecks and optimize critical execution paths',
        ],
      },
      project: {
        title: `Pre-Capstone: AI-Augmented ${cleanGoal} Production System`,
        description: `Develop an innovative pre-capstone system integrating modern APIs, intelligence layer, and robust security.`,
        resources: [
          { title: 'GitHub Open Source Capstone Showcases', url: 'https://github.com', isFree: true },
        ],
        actionChecklist: [
          `Integrate advanced intelligence and automation into ${cleanGoal} platform`,
          'Perform end-to-end security audit and sanitization tests',
        ],
      },
      careerMilestone: {
        category: 'internship',
        title: `AICTE / Industry Summer Internship (${cleanGoal})`,
        description: `Complete an 8-12 week supervised industry internship via the official AICTE Portal or top enterprises.`,
        resources: [
          { title: 'AICTE Official Internship Portal', url: 'https://internship.aicte-india.org', isFree: true },
        ],
        actionChecklist: [
          `Complete 8-12 weeks industry internship in ${cleanGoal} with signed supervisor verification`,
        ],
      },
    },
    8: {
      theme: `Semester 8 — Major Capstone System & Career Launch (${cleanGoal})`,
      focusSummary: `Deliver your definitive capstone project, pass final placement rounds, and transition smoothly into full-time roles.`,
      coreSubject: {
        title: `Architecture, Security Governance & Professional Standards (${cleanGoal})`,
        description: `Enterprise security standards, threat modeling, code quality auditing, and ethical engineering practices.`,
        resources: [
          { title: 'IEEE Computer Society Standards', url: 'https://www.computer.org', isFree: true },
        ],
        actionChecklist: [
          'Perform comprehensive security testing and compliance audits',
          'Produce detailed OpenAPI or architecture specifications',
        ],
      },
      skill: {
        title: `End-to-End Automated Testing, Auditing & Documentation`,
        description: `Implement unit and integration testing, produce technical documentation, and deliver professional presentation decks.`,
        resources: [
          { title: 'Playwright & Testing Framework Docs', url: 'https://playwright.dev', isFree: true },
        ],
        actionChecklist: [
          'Achieve 80%+ automated test coverage across core system modules',
          'Author complete technical user manual and deployment guides',
        ],
      },
      project: {
        title: `Major Degree Capstone: Production ${cleanGoal} Solution`,
        description: `Final definitive degree capstone project featuring comprehensive architecture, live cloud deployment, and full documentation.`,
        resources: [
          { title: 'AICTE National Student Project Scheme', url: 'https://www.aicte-india.org', isFree: true },
        ],
        actionChecklist: [
          'Deploy complete production system supporting live authenticated users',
          'Conduct load testing demonstrating rock-solid performance stability',
          'Publish project demo video, documentation, and source code repository',
        ],
      },
      careerMilestone: {
        category: 'internship',
        title: `Campus Placement Drives & AICTE National Career Launch`,
        description: `Participate in on-campus and national placement drives, finalize full-time job offers, and launch career.`,
        resources: [
          { title: 'AICTE National Placement Portal', url: 'https://internship.aicte-india.org', isFree: true },
        ],
        actionChecklist: [
          `Clear on-campus placement rounds for ${cleanGoal} roles`,
          'Finalize employment offer letters and join alumni mentorship network',
        ],
      },
    },
  };
}
