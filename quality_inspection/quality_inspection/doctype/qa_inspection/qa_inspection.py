# Copyright (c) 2022, Precihole and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class QAInspection(Document):
	pass
def on_save(self):
	if self.workflow_state== "Draft":
		if self.item:
			for i in self.item:
				if i.type == "Deviation":
					frappe.db.set_value("QA Inspection",self.name,"workflow_state","Design Approval Pending")
def before_submit(self):
	if self.item:
		for item in self.item:
			if item.qty == 0:
				item.delete()
	#as per req added date is save when submitting doc
	self.date = frappe.utils.now()
def before_cancel(self):
	if not self.cancel_remark:
		frappe.throw("Remark is Manadatory Before Cancel")
def before_save(self):
	for child in self.item:
		if child.type == "Rework":
			if not child.action_to_be_taken:
				frappe.throw("Action to be taken Mandatory")