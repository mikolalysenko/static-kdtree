# node 0.10.26

| Data Structure | [Linear scan](http://en.wikipedia.org/wiki/Brute-force_search) | [static-kdtree](https://github.com/mikolalysenko/static-kdtree) | [Ubilabs kdtree](https://github.com/ubilabs/kd-tree-javascript) | [node-kdtree](https://github.com/justinethier/node-kdtree) |
| :--- | ---: | ---: | ---: | ---: |
| Dynamic? | ✓ | ✗ | ✓ | ✓ |
| Works in browser? | ✓ | ✓ | ✓ | ✗ |
| Construction: (n=100,d=2) | 0ms | 0.1868ms | 0.1069ms | 0.0354ms |
| Construction: (n=1000,d=2) | 0ms | 2.106ms | 1.771ms | 0.437ms |
| Construction: (n=10000,d=2) | 0ms | 25.09ms | 33.56ms | 6.39ms |
| Construction: (n=100000,d=2) | 0ms | 305.3ms | 776.6ms | 129.2ms |
| Range: (n=100,d=2) | 0.001216ms | 0.003845ms | N/A | N/A |
| Range: (n=1000,d=2) | 0.01306ms | 0.01295ms | N/A | N/A |
| Range: (n=10000,d=2) | 0.1282ms | 0.0823ms | N/A | N/A |
| Range: (n=100000,d=2) | 1.719ms | 0.726ms | N/A | N/A |
| rNN: (n=100,d=2) | 0.001444ms | 0.006291ms | ERROR | 0.00343ms |
| rNN: (n=1000,d=2) | 0.01475ms | 0.01801ms | ERROR | 0.02162ms |
| rNN: (n=10000,d=2) | 0.1467ms | 0.1046ms | ERROR | 0.2172ms |
| rNN: (n=100000,d=2) | 2.109ms | 1.024ms | ERROR | 2.863ms |
| kNN: (n=100,d=2,k=1) | 0.001369ms | 0.004863ms | 0.005388ms | 0.001727ms |
| kNN: (n=1000,d=2,k=1) | 0.013787543471387923ms | 0.006304141637685741ms | 0.006139740752450206ms | 0.0022036041732532404ms |
| kNN: (n=10000,d=2,k=1) | 0.13632ms | 0.00801ms | 0.00768ms | 0.00369ms |
| kNN: (n=100000,d=2,k=1) | 1.498391167192429ms | 0.009558359621451105ms | 0.009842271293375395ms | 0.009242902208201892ms |
| kNN: (n=100,d=2,k=10) | 0.00749ms | 0.01321ms | 0.01768ms | N/A |
| kNN: (n=1000,d=2,k=10) | 0.0644794952681388ms | 0.016309148264984228ms | 0.019779179810725554ms | N/A |
| kNN: (n=10000,d=2,k=10) | 0.591ms | 0.0197ms | 0.0307ms | N/A |
| kNN: (n=100000,d=2,k=10) | 6.375625ms | 0.021875ms | 0.03125ms | N/A |
| kNN: (n=100,d=2,k=100) | 0.0079ms | 0.0512ms | 0.0679ms | N/A |
| kNN: (n=1000,d=2,k=100) | 0.06875ms | 0.078125ms | 0.154375ms | N/A |
| kNN: (n=10000,d=2,k=100) | 0.602ms | 0.089ms | 0.213ms | N/A |
| kNN: (n=100000,d=2,k=100) | 6.612ms | 0.092ms | 0.219ms | N/A |