// In-memory database with initial dummy data
const initialLawsuits = [
  {
    id: 1,
    lawsuitNumber: 'CASE-2025-001',
    nextDate: new Date('2025-02-01'),
    actions: [
      {
        actionId: '1',
        completed: false,
        createdAt: new Date('2025-01-24'),
      },
      {
        actionId: '2',
        completed: true,
        createdAt: new Date('2025-01-24'),
      }
    ],
  },
  {
    id: 2,
    lawsuitNumber: 'CASE-2025-002',
    nextDate: new Date('2025-01-26'),
    actions: [
      {
        actionId: '1',
        completed: true,
        createdAt: new Date('2025-01-24'),
      },
      {
        actionId: '2',
        completed: false,
        createdAt: new Date('2025-01-24'),
      }
    ],
  },
  {
    id: 3,
    lawsuitNumber: 'CASE-2025-003',
    nextDate: new Date('2025-03-15'), 
    actions: [
      {
        actionId: '2',
        completed: false,
        createdAt: new Date('2025-01-24'),
      }
    ],
  },
  {
    id: 4,
    lawsuitNumber: 'CASE-2025-004',
    nextDate: new Date('2025-01-25'), 
    actions: [
      {
        actionId: '1',
        completed: false,
        createdAt: new Date('2025-01-24'),
      },
      {
        actionId: '2',
        completed: false,
        createdAt: new Date('2025-01-24'),
      },
      {
        actionId: '3',
        completed: false,
        createdAt: new Date('2025-01-24'),
      }
    ],
  },
  {
    id: 5,
    lawsuitNumber: 'CASE-2025-005',
    nextDate: new Date('2025-01-23'), 
    actions: [
      {
        actionId: '1',
        completed: false,
        createdAt: new Date('2025-01-24'),
      }
    ],
  }
];

class LawsuitService {
  constructor() {
    this.lawsuits = [...initialLawsuits];
  }

  // Add a new lawsuit
  addLawsuit(lawsuitNumber, nextDate, selectedActions = {}) {
    const newLawsuit = {
      id: this.lawsuits.length + 1,
      lawsuitNumber,
      nextDate,
      actions: Object.entries(selectedActions)
        .filter(([_, isSelected]) => isSelected)
        .map(([actionId]) => ({
          actionId,
          completed: false,
          createdAt: new Date()
        }))
    };
    this.lawsuits.push(newLawsuit);
    return newLawsuit;
  }

  // Get all lawsuits
  getAllLawsuits() {
    return this.lawsuits;
  }

  // Get a specific lawsuit
  getLawsuit(id) {
    return this.lawsuits.find(lawsuit => lawsuit.id === id);
  }

  // Complete an action in a lawsuit
  completeAction(lawsuitId, actionId) {
    const lawsuit = this.getLawsuit(lawsuitId);
    if (!lawsuit) return false;

    const action = lawsuit.actions.find(a => a.actionId === actionId);
    if (!action) return false;

    action.completed = true;
    action.completedAt = new Date(); 
    return true;
  }

  // Update action status
  updateActionStatus(lawsuitId, actionId, completed) {
    const lawsuit = this.getLawsuit(lawsuitId);
    if (!lawsuit) return false;

    const action = lawsuit.actions.find(a => a.actionId === actionId);
    if (!action) return false;

    action.completed = completed;
    if (completed) {
      action.completedAt = new Date();
    } else {
      delete action.completedAt;
    }
    return true;
  }

  // Clear all lawsuits (for testing)
  clearLawsuits() {
    this.lawsuits = [];
  }
}

// Create a singleton instance
const lawsuitService = new LawsuitService();

// Export the singleton instance
export { lawsuitService as LawsuitService };
