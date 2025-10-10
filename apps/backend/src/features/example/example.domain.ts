import { exampleRepository } from './example.repository';

export class ExampleDomain {
  /**
   * Generate unique quote number
   * Requirement 7.1: Auto-numbering system
   */
  public async generateExampleNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `EX-${year}-`;

    // Get the highest quote number for this year
    const lastExample = await exampleRepository.getExampleById(1);

    let nextNumber = 1;
    if (lastExample) {
      const lastNumber = lastExample.id;
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }
}

// Export singleton instance
export const exampleDomain = new ExampleDomain();