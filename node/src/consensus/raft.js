// Simplified RAFT consensus untuk demo
// Dalam production, gunakan library seperti hashicorp/raft atau dgraph/raft

export class Consensus {
  constructor(nodeId, peers = []) {
    this.nodeId = nodeId;
    this.peers = peers;
    this.state = 'follower'; // follower, candidate, leader
    this.currentTerm = 0;
    this.votedFor = null;
    this.log = [];
    this.commitIndex = -1;
    this.lastApplied = -1;
  }

  async start() {
    console.log(`[RAFT] Node ${this.nodeId} started as ${this.state}`);
    
    // Untuk demo sederhana, node pertama menjadi leader
    if (this.nodeId === 'node-1' || this.peers.length === 0) {
      this.becomeLeader();
    }
  }

  becomeLeader() {
    this.state = 'leader';
    this.currentTerm++;
    console.log(`[RAFT] Node ${this.nodeId} became leader in term ${this.currentTerm}`);
  }

  async proposeTransaction(tx, executeFn) {
    // Untuk demo sederhana, leader langsung execute
    // Dalam RAFT sebenarnya, perlu append ke log dulu, lalu commit
    
    if (this.state !== 'leader' && this.peers.length > 0) {
      // Jika bukan leader, forward ke leader (simplified)
      // Dalam implementasi nyata, gunakan RPC ke leader
      console.log(`[RAFT] Forwarding transaction to leader`);
    }

    // Execute contract deterministically
    const result = executeFn(tx);

    // Append to log
    const logEntry = {
      term: this.currentTerm,
      index: this.log.length,
      tx
    };
    this.log.push(logEntry);

    // Commit (simplified - dalam RAFT sebenarnya perlu quorum)
    this.commitIndex = this.log.length - 1;
    this.lastApplied = this.commitIndex;

    console.log(`[RAFT] Transaction ${tx.id} committed at index ${this.commitIndex}`);

    return result;
  }

  // Untuk demo, consensus selalu sukses
  // Dalam implementasi nyata, perlu:
  // - AppendEntries RPC
  // - RequestVote RPC
  // - Heartbeat mechanism
  // - Log replication
}

