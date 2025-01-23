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
    nextDate: new Date('2025-01-26'), // 2 days from now
    actions: [
      {
        actionId: '1',
        completed: true,
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
    id: 3,
    lawsuitNumber: 'CASE-2025-003',
    nextDate: new Date('2025-03-15'), // Future date
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
    nextDate: new Date('2025-01-25'), // Tomorrow
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
    nextDate: new Date('2025-01-23'), // Yesterday (overdue)
    actions: [
      {
        actionId: '1',
        completed: false,
        createdAt: new Date('2025-01-24'),
      }
    ],
  }
];

let lawsuits = [...initialLawsuits];
let lastId = initialLawsuits.length;

export const LawsuitService = {
  // Add a new lawsuit
  addLawsuit: (lawsuitNumber, nextDate, selectedActions) => {
    const lawsuit = {
      id: ++lastId,
      lawsuitNumber,
      nextDate,
      actions: Object.entries(selectedActions)
        .filter(([_, isSelected]) => isSelected)
        .map(([actionId, _]) => ({
          actionId,
          completed: false,
          createdAt: new Date(),
        })),
    };
    lawsuits.push(lawsuit);
    return lawsuit;
  },

  // Get all lawsuits
  getAllLawsuits: () => {
    return [...lawsuits];
  },

  // Get a specific lawsuit
  getLawsuit: (id) => {
    return lawsuits.find(lawsuit => lawsuit.id === id);
  },

  // Clear all lawsuits (for testing)
  clearLawsuits: () => {
    lawsuits = [...initialLawsuits];
    lastId = initialLawsuits.length;
  }
};
