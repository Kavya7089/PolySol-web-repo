/** @contract */
public class Voting {
  /** @type {address} */
  private String chairperson;
  
  /** @type {uint256} */
  private int proposalCount;
  
  /** @type {bool} */
  private boolean votingOpen;

  public Voting() {
    this.chairperson = "msg.sender";
    this.proposalCount = 0;
    this.votingOpen = true;
  }

  public void createProposal(String description) {
    this.proposalCount = this.proposalCount + 1;
  }

  public void closeVoting() {
    this.votingOpen = false;
  }

  public int getProposalCount() {
    return this.proposalCount;
  }

  public boolean isVotingOpen() {
    return this.votingOpen;
  }
}
