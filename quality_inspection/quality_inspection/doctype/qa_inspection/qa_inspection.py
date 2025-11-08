# Copyright (c) 2022, Precihole and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import _
class QAInspection(Document):
	def before_save(self):
		rework = 0
		reject = 0
		deviation = 0
		if self.item:	
			for child in self.get("item"):
				if child.type == "Rework":
					if not child.action_to_be_taken:
						frappe.throw("Action to be taken is Mandatory")
				# if deviation then remark is mandatory
				elif child.type == "Deviation":
					if not child.details:
						frappe.throw(_("Details is Mandatory for Deviation in Row : {0} for Item : {1}").format(child.idx,child.item_code,child.qty))
				# getting the total of rework/reject/deviation calulated here
				if child.type:
					if child.type == "Rework":
						rework += child.qty
					elif child.type == "Reject":
						reject = reject + child.qty
					elif child.type == "Deviation":
						deviation += child.qty
		self.total_rework = rework
		self.total_reject = reject
		self.total_deviation = deviation
		self.total_accepted_qty = self.total_received_qty - self.total_deviation - self.total_reject - self.total_rework
		# for setting aprroved by department
		if self.workflow_state == "Design Approval Pending":
			if not self.approved_by_qa_dept:
				self.approved_by_qa_dept = frappe.session.user 

		

		if not self.item or len(self.item) == 0:
			pass
		elif not self.custom_accepted_item or len(self.custom_accepted_item) == 0:
			frappe.msgprint(_('The "Custom Accepted Item" table is empty. No changes made.'))
		else:
			item_quantities = {}

			
			for row in self.item:
				item_code = row.get("item_code")
				qty = row.get("qty", 0) or 0  
				if item_code:
					item_quantities[item_code] = item_quantities.get(item_code, 0) + qty

			updated = False
			for row in self.custom_accepted_item:
				item_code = row.get("item_code")
				reject_qty = item_quantities.get(item_code, 0) if item_code else 0
				row.reject_qty = reject_qty

			
				received_qty = row.get("received_qty", 0) or 0  
				row.accepted_qty = received_qty - reject_qty
				updated = True

			if updated:
				pass
			else:
				frappe.msgprint(_('No matching items found to update the rejected and accepted quantities.'))


	def before_submit(self):
		if self.item:
			for item in self.get("item"):
				if item.qty == 0:
					item.delete(ignore_permissions=True)
		#as per req added date is save when submitting doc
		self.date = frappe.utils.now()
		# for setting aprroved by department
		if self.workflow_state == "Submitted":
			if self.approved_by_qa_dept:
				if not self.approved_by_design_dept:
					self.approved_by_design_dept = frappe.session.user
			if not self.approved_by_qa_dept:
				self.approved_by_qa_dept = frappe.session.user
			
	# ramark validation
	def before_cancel(self):
		if not self.cancel_remark:
			frappe.throw("Remark is Manadatory Before Cancel")



