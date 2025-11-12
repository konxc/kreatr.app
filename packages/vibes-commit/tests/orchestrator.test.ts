import { Orchestrator } from '../src/core/orchestrator';

describe('Orchestrator', () => {
  it('should create an instance', () => {
    const orchestrator = new Orchestrator();
    expect(orchestrator).toBeDefined();
  });

  it('should have analyzer', () => {
    const orchestrator = new Orchestrator();
    expect(orchestrator.getAnalyzer()).toBeDefined();
  });

  it('should have session tracker', () => {
    const orchestrator = new Orchestrator();
    expect(orchestrator.getSessionTracker()).toBeDefined();
  });
});
