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
					if not child.remark:
						frappe.throw(_("Remark is Mandatory for Deviation in Row : {0} for Item : {1}").format(child.idx,child.item_code,child.qty))
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

	def before_submit(self):
		if self.item:
			for item in self.get("item"):
				if item.qty == 0:
					item.delete()
		#as per req added date is save when submitting doc
		self.date = frappe.utils.now()
	# ramark validation
	def before_cancel(self):
		if not self.cancel_remark:
			frappe.throw("Remark is Manadatory Before Cancel")
