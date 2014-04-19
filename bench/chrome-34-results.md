# Chrome 34

| Data Structure | [Linear scan](http://en.wikipedia.org/wiki/Brute-force_search) | [static-kdtree](https://github.com/mikolalysenko/static-kdtree) | [Ubilabs kdtree](https://github.com/ubilabs/kd-tree-javascript) |
| :--- | ---: | ---: | ---: |
| Dynamic? | ✓ | ✗ | ✓ |
| Works in browser? | ✓ | ✓ | ✓ |
| Construction: (n=100,d=2) | 0ms | 0.1418ms | 0.1166ms |
| Construction: (n=1000,d=2) | 0ms | 1.51ms | 2.601ms |
| Construction: (n=10000,d=2) | 0ms | 17.91ms | 57.8ms |
| Construction: (n=100000,d=2) | 0ms | 275.1ms | 1107.8ms |
| Range: (n=100,d=2) | 0.000847ms | 0.0026ms | N/A |
| Range: (n=1000,d=2) | 0.01018ms | 0.00663ms | N/A |
| Range: (n=10000,d=2) | 0.0989ms | 0.0364ms | N/A |
| Range: (n=100000,d=2) | 1.06ms | 0.322ms | N/A |
| rNN: (n=100,d=2) | 0.001142ms | 0.002738ms | ERROR |
| rNN: (n=1000,d=2) | 0.01126ms | 0.00567ms | ERROR |
| rNN: (n=10000,d=2) | 0.1131ms | 0.025ms | ERROR |
| rNN: (n=100000,d=2) | 1.33ms | 0.225ms | ERROR |
| kNN: (n=100,d=2,k=1) | 0.001104ms | 0.00186ms | 0.04049ms |
| kNN: (n=1000,d=2,k=1) | 0.010569079987353779ms | 0.0028106228264306037ms | 0.05377805880493203ms |
| kNN: (n=10000,d=2,k=1) | 0.1058ms | 0.00395ms | 0.06418ms |
| kNN: (n=100000,d=2,k=1) | 1.0704416403785488ms | 0.004763406940063091ms | 0.07981072555205047ms |
| kNN: (n=100,d=2,k=10) | 0.00632ms | 0.00659ms | 0.13616ms |
| kNN: (n=1000,d=2,k=10) | 0.04766561514195584ms | 0.008958990536277602ms | 0.16504731861198738ms |
| kNN: (n=10000,d=2,k=10) | 0.445ms | 0.0126ms | 0.2015ms |
| kNN: (n=100000,d=2,k=10) | 4.4703125ms | 0.0128125ms | 0.2046875ms |
| kNN: (n=100,d=2,k=100) | 0.0085ms | 0.032ms | 0.533ms |
| kNN: (n=1000,d=2,k=100) | 0.0546875ms | 0.0525ms | 1.0634375ms |
| kNN: (n=10000,d=2,k=100) | 0.45ms | 0.058ms | 1.152ms |
| kNN: (n=100000,d=2,k=100) | 4.543ms | 0.059ms | 1.176ms |
