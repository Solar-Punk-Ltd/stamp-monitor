# mssd-monitor

## Prerequisites

Ensure the following are installed on your system:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Solar-Punk-Ltd/mssd-monitor.git
cd mssd-monitor
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Build the project

To compile the TypeScript code into JavaScript, run:

```bash
pnpm build
```

### 4. Run the project

To start the application, run:

```bash
node dist/index.js --test
```

or

```bash
node dist/index.js --prod
```

The program generates CSV files in the `data` folder.  
Each file is named according to the following convention:

```text
<mode>-YYYYMMDD-HHMMSS.csv
```

- `<mode>`: Either `test` or `prod`, depending on the run mode.
- `YYYYMMDD`: The date the file was generated (year, month, day).
- `HHMMSS`: The time the file was generated (hour, minute, second).

For example: `test-20240615-153045.csv`. Sample output:

```csv
stampid,valid,expiration,remainingGB
0ab9bf811529725f022048e44a7c82b1f335ce0ddb38f5384a03e445b4e70adc,true,2025-05-16T05:21:19.158Z,29.10
a91041437ccf056ba00fd252809a430e859422214db9f2a93735da49f526ff08,true,2025-05-16T05:24:59.225Z,29.13
13264042758a002511b7ffdd2a1d2e4da0e888226f3e5ec5e77f1221db7fc5e9,true,2025-05-17T04:59:09.288Z,39.79
5fdc20bca95dc632f98df421966740eeeb6a89a814f87b0cc4231a91d72cbfe8,true,2025-05-17T04:59:19.350Z,39.79
e2a1492e7f0b5a2fcf4bae92abb322eb159aa6a8f01091c8cda5778ccc8981d8,true,2025-05-17T04:59:34.413Z,39.79
762738e69cdb802a75a2d96e753117ff6095cf41fc80cd9713fc14fc8cd9a2c1,true,2025-05-17T04:59:54.476Z,39.79
d1d0599f6349b4bba8cea7c60782bf12acb2af723f1387c1e29eb5fb590ec5f7,true,2025-05-17T05:00:14.541Z,39.79
ee7f26442c70d2996efcfd958dc28e4ae67fa68e0d593daab67dcb4d191d5248,true,2025-05-17T05:00:39.603Z,39.80
8fcb381c20c488b85db1e1ab4141af04f5bebec6296319e1a93347be2dde1d2b,true,2025-05-17T05:01:04.673Z,39.80
72a220ed6b1bb14e9c8d2ac0e0487a02589e40368e9ba4b3b6cbd71c54525b11,true,2025-05-17T05:01:14.736Z,39.80
60839b3024bc296c82561fe9c31abf148f83aeeb8c6e7f89d65ebe4b2a7cf921,true,2025-05-17T05:01:29.796Z,39.80
c61b974d71bda704f979f348463bc67519101a750cfba8d4d6c4d6c838157d11,true,2025-05-17T05:01:44.856Z,39.81
99edb6855280fd611c3f65ce851f5dad294282d2682377960fc07149223d06d1,true,2025-05-17T05:02:04.918Z,39.81
82278126cf258fa4b7668057d91b1bfcec87e0e372de6c666e88f0ca097dd1d2,true,2025-05-17T05:02:14.982Z,39.81
7519a6acdb4a9d47962c82480b76196a0ce68101a76e39084cbd04ab44c89918,true,2025-05-17T05:02:30.050Z,39.81
8ae88642906148eb592bcedf564355049271440d6959f8a2adf0bbbc0fb543fe,true,2025-05-17T05:02:55.116Z,39.81
78c03440c4f03d6a11b78772776366aff1856d18a3805b1448ed05da41aa3834,true,2025-05-17T05:03:10.177Z,39.82
6576a32d9f80632f02daf90cb890c60658c534e90283682b9dfc4f4a2e120bc8,true,2025-05-17T05:03:25.241Z,39.82
7f843253265b28c3a0698f46ca72942fb4a22af7eec84388bc8c593804bad06d,true,2025-05-17T05:03:40.303Z,39.82
ab5fb1d37f5b516cdf5e1e0f7f427bbef8752630195cbaeb48edf030621dbfbb,true,2025-05-17T05:03:55.370Z,39.82
```

- __stampid__ - PostageBatchID
- __valid__ - Whether the PostageBatch is valid
- __expiration__ - Expiration date of the PostageBatch
- __remainingGB__ - Remaining GB of the PostageBatch
