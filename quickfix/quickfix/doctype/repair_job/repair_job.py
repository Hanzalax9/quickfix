# Copyright (c) 2026, Hanzala and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RepairJob(Document):

    def validate(self):
        self.validate_dates()
        self.validate_parts()
        self.calculate_totals()

    def validate_dates(self):
        if self.expected_delivery_date and self.received_date:
            if self.expected_delivery_date < self.received_date:
                frappe.throw(
                    "Expected Delivery Date cannot be before Received Date."
                )

    def validate_parts(self):
        for row in self.parts_used:
            if row.quantity <= 0:
                frappe.throw("Part quantity must be greater than 0.")

            if row.unit_price < 0:
                frappe.throw("Unit Price cannot be negative.")

    def calculate_totals(self):
        parts_total = 0

        for row in self.parts_used:
            row.amount = (row.quantity or 0) * (row.unit_price or 0)
            parts_total += row.amount

        self.parts_total = parts_total
        self.grand_total = parts_total + (self.service_charges or 0)