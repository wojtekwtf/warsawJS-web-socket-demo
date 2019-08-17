import { ROLES } from './consts';
import data from './data';
import * as ui from './ui';
import { connectAsTrainer } from './trainer';

export function activateRoleSelection() {
  ui.showRoleSelection();
}

function selectStudentRole() {
  data.role = ROLES.STUDENT;
  ui.hideRoleSelection();
  ui.showStudentIdentificationForm();
}

function selectTrainerRole() {
  data.role = ROLES.TRAINER;
  ui.hideRoleSelection();
  ui.showHeader('Trainer');
  connectAsTrainer();
}

export function initializeRoleSelectionPart() {
  ui.addEventListener('#i-am-a-student-button', 'click', selectStudentRole);
  ui.addEventListener('#i-am-a-trainer-button', 'click', selectTrainerRole);
}
