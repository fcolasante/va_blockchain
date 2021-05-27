var singleNode = {
  "name": "single",
  "description": `. A single committee refers to a special group of nodes among the participating nodes which
                        actively participate in the consensus process by producing
                        blocks and extending the blockchain`,
  "children": [
    { "name": "Type", "selected": true},
    { "name": "Formation"},
    { "name": "Configuration"}
  ]
};

var MultipleNode = {
  "name": "Multiple",
  "children": [
    { "name": "Topology"},
    { "name": "COnfiguration"}
  ]
};

var UnderlyingNode = {
  "name": "Underlying mechanism",
  "children": [
    { "name": "Lottery" },
    { "name": "Voting" },
    { "name": "Coin-age" },
  ]
};

var BlockRewardNode = {
  "name": "Block & reward properties",
  "description": `Properties under this category can be utilised as quantitative metrics to differentiate different crypto-currencies.
    These properties do not necessarily characterise different consensus algorithm directly, however, most of them (except the genesis
date) have a direct and indirect impact on how consensus is
achieved in a particular crypto-currency based blockchain
system. For example, block reward incentivises miners to
act accordingly by solving a cryptographic puzzle, which is
then ultimately used to achieve consensus. `,

  "children": [
    { "name": "Genesis date" , "description": `represents the timestamp when the very
                                        first block was created for a particular crypto-currency.`},
    { "name": "Block reward" },
    { "name": "Total supply" },
    { "name": "Block time", "value" : "10s"},
  ]
};


var AttackVectorsChildren = [
  { "name": "Adversary tolerance" , "value": true},
  { "name": "Sybil"                , "value": false },
  { "name": "Dos"                  ,"value": false },
  { "name": "NAS"                  ,"value": true },
  { "name": "Bribing"              ,"value": false },
  { "name": "Long-range"           ,"value": false },
  { "name": "Accumulation"         ,"value": true },
  { "name": "Grinding"             ,"value": false },
  { "name": "Cartel"               ,"value": false },
]
var SecurityNodes = {
  "name": "Security properties",
  "children": [
    { "name": "Authentication" , "value": false},
    { "name": "Non-repuditation", "value": true },
    { "name": "Censorship resistance", "value": true },
    { "name": "Block time" },
    { "name": "Attack vectors", "children": AttackVectorsChildren}
  ]
};


var PerformanceNode = {
  "name": "Performance properties",
  "description": `The properties belonging to this group can be utilised
to measure the quantitative performance of a consensus
protocol.`,
  "children": [
    { "name": "Fault tolerance",
      "description": `signifies the maximum faulty nodes the
respective consensus protocol can tolerate.`
    },
    { "name": "Throughput", "description": `implies the number of transactions the
protocol can process in one second.` },
    { "name": "Scalability", "description": `refers to the ability to grow in size and
functionalities with- out degrading the performance of
the original system` },
    { "name": "Latency" , "description": `refers to ”the time it takes from when a
transaction is proposed until consensus has been reached on
it” [5]. It is also known as finality`},
    { "name": "Energy consumption", "description" : `indicates if the algorithm (or
the utilising system) consumes a significant amount of
energy.` },
  ]
};

export const treeData =
  {
    "name": "Consensus properties",
    "children": [
      {
        "name": "Structural properties",
        "description": `define how different nodes within a
                        blockchain network are structured to participate in a consensus algorithm`,
        "selected": true,
        "children": [
          { "name": "Node type" ,
            "description": `It refers to different types of nodes that
        a consensus algorithm is required to engage with to achieve its consensus.`
          },
          { "name": "Structure type",
            "children": [
              singleNode,
              MultipleNode
            ]
          },
          UnderlyingNode
        ]
      },
      BlockRewardNode,
      SecurityNodes,
      PerformanceNode
    ]
  };
