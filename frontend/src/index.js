import './style.css';
import { initializeRoleSelectionPart, activateRoleSelection } from './roleSelection';
import { initializeStudentPart } from './student';
import { initializeTrainerPart } from './trainer';

initializeRoleSelectionPart();
initializeStudentPart();
initializeTrainerPart();

activateRoleSelection();
