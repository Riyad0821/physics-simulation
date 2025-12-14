import { create } from 'zustand';

export type SimulationState = 'IDLE' | 'FETCH' | 'DECODE' | 'EXECUTE';

export interface BusState {
  address: number | null; // Address Bus (Unidirectional CPU -> Mem)
  data: number | null;    // Data Bus (Bidirectional)
  control: string | null; // Control Bus (Read/Write signals)
  activeLines: {
    address: boolean;
    data: boolean;
    control: boolean;
  };
}

export interface Registers {
  PC: number;   // Program Counter
  MAR: number;  // Memory Address Register
  MDR: number;  // Memory Data Register
  CIR: number;  // Current Instruction Register (Opcode)
  ACC: number;  // Accumulator
}

interface LinuxSystemState {
  currentStep: number;
  activeComponent: string | null;

  // Simulation State
  simulationState: SimulationState;
  microStep: number;  // To track micro-operations within a cycle
  
  registers: Registers;
  buses: BusState;
  memory: number[]; // Simple 256 bytes memory
  
  // Actions
  setActiveComponent: (component: string | null) => void;
  
  nextMicroStep: () => void;
  resetSimulation: () => void;
  loadProgram: (program: number[]) => void;
}

const INITIAL_MEMORY = new Array(256).fill(0);
// Simple Program:
// 0: 10 (LDA)
// 1: 100 (Address 100)
// 2: 20 (ADD)
// 3: 101 (Address 101)
// 4: 30 (STO)
// 5: 102 (Address 102)
// ...
// 100: 5 (Data)
// 101: 3 (Data)
INITIAL_MEMORY[0] = 10; INITIAL_MEMORY[1] = 100;
INITIAL_MEMORY[2] = 20; INITIAL_MEMORY[3] = 101;
INITIAL_MEMORY[4] = 30; INITIAL_MEMORY[5] = 102;
// Data
INITIAL_MEMORY[100] = 5;
INITIAL_MEMORY[101] = 3;

export const useLinuxStore = create<LinuxSystemState>((set, get) => ({
  currentStep: 0,
  activeComponent: null,

  simulationState: 'IDLE',
  microStep: 0,
  
  registers: { PC: 0, MAR: 0, MDR: 0, CIR: 0, ACC: 0 },
  buses: { address: null, data: null, control: null, activeLines: { address: false, data: false, control: false } },
  memory: INITIAL_MEMORY,

  setActiveComponent: (component) => set({ activeComponent: component }),

  loadProgram: (program) => {
    const mem = new Array(256).fill(0);
    program.forEach((v, i) => mem[i] = v);
    set({ memory: mem });
  },

  nextMicroStep: () => {
      const state = get();
      const { simulationState, microStep, registers, memory } = state;
      
      // Default: Reset bus activity every step, re-enable as needed
      let newBuses: BusState = { 
          address: null, data: null, control: null, 
          activeLines: { address: false, data: false, control: false } 
      };
      
      let nextState = simulationState;
      let nextMicro = microStep + 1;
      let nextRegs = { ...registers };
      let nextMem = [...memory];

      // --- FETCH PHASE ---
      if (simulationState === 'FETCH') {
          // Micro-Op 1: PC -> MAR
          if (microStep === 0) {
              nextRegs.MAR = registers.PC;
              newBuses.address = registers.PC;
              newBuses.activeLines.address = true; // Visual: PC traveling to MAR via Address Bus (conceptually)
              // Actually in simple Von Neumann: PC -> Bus -> MAR. 
              // We'll visualize PC -> MAR directly in CPU, but Address Bus active for Memory Access next.
          }
          // Micro-Op 2: Memory Read Request (MAR -> Address Bus, Control Read)
          else if (microStep === 1) {
             newBuses.address = registers.MAR;
             newBuses.activeLines.address = true;
             newBuses.control = 'READ';
             newBuses.activeLines.control = true;
             // Memory highlights would happen here
          }
          // Micro-Op 3: Memory -> MDR
          else if (microStep === 2) {
             newBuses.address = registers.MAR; // Address still held
             newBuses.activeLines.address = true;
             newBuses.data = memory[registers.MAR];
             newBuses.activeLines.data = true; // Visual: Data moving from Mem to CPU
             nextRegs.MDR = memory[registers.MAR];
          }
          // Micro-Op 4: MDR -> CIR
          else if (microStep === 3) {
              nextRegs.CIR = registers.MDR;
          }
          // Micro-Op 5: Increment PC
          else if (microStep === 4) {
              nextRegs.PC += 1;
              if (state.activeComponent !== 'CPU') set({ activeComponent: 'CPU' }); // Highlight CPU
              
              // End of Fetch, go to Decode
              nextState = 'DECODE';
              nextMicro = 0;
          }
      }
      
      // --- DECODE PHASE ---
      else if (simulationState === 'DECODE') {
          // Micro-Op 0: Decode Opcode (simplified, just transition)
          // 10 = LDA, 20 = ADD, 30 = STO, 0 = HLT
          nextState = 'EXECUTE';
          nextMicro = 0;
      }

      // --- EXECUTE PHASE ---
      else if (simulationState === 'EXECUTE') {
          const opcode = registers.CIR;
          
          // Instruction: LDA (Load Accumulator)
          if (opcode === 10) {
              if (microStep === 0) {
                  // Operand Address is next byte. So we need to fetch operand address.
                  // Wait, CIR only has opcode? In this simplified model, implicit operand fetch?
                  // Let's assume simplified: CIR has Opcode. PC points to Operand Address now.
                  
                  // Step 1: PC -> MAR (to fetch address of operand)
                  nextRegs.MAR = registers.PC;
                  newBuses.address = registers.PC;
                  newBuses.activeLines.address = true;
              } else if (microStep === 1) {
                  // Step 2: Read Memory (Operand ADDRESS) -> MDR
                   newBuses.address = registers.MAR;
                   newBuses.activeLines.address = true;
                   newBuses.control = 'READ';
                   newBuses.activeLines.control = true;
                   
                   nextRegs.MDR = memory[registers.MAR]; // usage: Get the address 100
                   nextRegs.PC += 1; // Increment PC past operand
              } else if (microStep === 2) {
                   // Step 3: MDR (Address 100) -> MAR (Effective Address)
                   nextRegs.MAR = registers.MDR;
              } else if (microStep === 3) {
                   // Step 4: Read Data at 100 -> MDR
                   newBuses.address = registers.MAR;
                   newBuses.activeLines.address = true;
                   newBuses.control = 'READ';
                   newBuses.activeLines.control = true;
                   newBuses.data = memory[registers.MAR]; // Value 5
                   newBuses.activeLines.data = true;
                   
                   nextRegs.MDR = memory[registers.MAR];
              } else if (microStep === 4) {
                   // Step 5: MDR -> ACC
                   nextRegs.ACC = registers.MDR;
                   
                   // End Instruction
                   nextState = 'FETCH';
                   nextMicro = 0;
              }
          }
          
          // Instruction: ADD (Add to Accumulator)
          else if (opcode === 20) {
              if (microStep === 0) {
                  // PC -> MAR (Fetch Operand Address)
                  nextRegs.MAR = registers.PC;
                  newBuses.address = registers.PC;
                  newBuses.activeLines.address = true;
              } else if (microStep === 1) {
                   // Read Operand Address
                   newBuses.address = registers.MAR;
                   newBuses.activeLines.address = true;
                   newBuses.control = 'READ';
                   newBuses.activeLines.control = true;
                   nextRegs.MDR = memory[registers.MAR];
                   nextRegs.PC += 1;
              } else if (microStep === 2) {
                   // Move Address to MAR
                   nextRegs.MAR = registers.MDR;
              } else if (microStep === 3) {
                   // Read Data
                   newBuses.address = registers.MAR;
                   newBuses.activeLines.address = true;
                   newBuses.control = 'READ';
                   newBuses.activeLines.control = true;
                   newBuses.data = memory[registers.MAR];
                   newBuses.activeLines.data = true;
                   nextRegs.MDR = memory[registers.MAR];
              } else if (microStep === 4) {
                   // ALU Operation: ACC + MDR -> ACC
                   nextRegs.ACC += registers.MDR;
                   nextState = 'FETCH';
                   nextMicro = 0;
              }
          }
          
          // Instruction: STO (Store Accumulator)
          else if (opcode === 30) {
               if (microStep === 0) {
                  // PC -> MAR (Fetch Target Address)
                  nextRegs.MAR = registers.PC;
                  newBuses.address = registers.PC;
                  newBuses.activeLines.address = true;
              } else if (microStep === 1) {
                   // Read Target Address
                   newBuses.address = registers.MAR;
                   newBuses.activeLines.address = true;
                   newBuses.control = 'READ';
                   newBuses.activeLines.control = true;
                   nextRegs.MDR = memory[registers.MAR];
                   nextRegs.PC += 1;
              } else if (microStep === 2) {
                   // Move Target Address to MAR
                   nextRegs.MAR = registers.MDR;
              } else if (microStep === 3) {
                   // Move ACC to MDR (to be written)
                   nextRegs.MDR = registers.ACC;
              } else if (microStep === 4) {
                   // Write MDR to Memory[MAR]
                   newBuses.address = registers.MAR;
                   newBuses.activeLines.address = true;
                   
                   newBuses.data = registers.MDR;
                   newBuses.activeLines.data = true;
                   
                   newBuses.control = 'WRITE';
                   newBuses.activeLines.control = true;
                   
                   nextMem = [...memory];
                   nextMem[registers.MAR] = registers.MDR;
                   
                   nextState = 'FETCH';
                   nextMicro = 0;
              }
          }
          // Default / Halt
          else {
              nextState = 'FETCH';
              nextMicro = 0;
          }
      }
      else {
          // IDLE -> Start
          nextState = 'FETCH';
          nextMicro = 0;
      }

      set({
          simulationState: nextState,
          microStep: nextMicro,
          registers: nextRegs,
          buses: newBuses,
          memory: nextMem
      });
  },

  resetSimulation: () => set({
      simulationState: 'IDLE',
      microStep: 0,
      registers: { PC: 0, MAR: 0, MDR: 0, CIR: 0, ACC: 0 },
      buses: { address: null, data: null, control: null, activeLines: { address: false, data: false, control: false } },
      memory: INITIAL_MEMORY
  })
}));
