// Copyright (c) 2026, Hanzala and contributors
// For license information, please see license.txt


// ===============================
// REPAIR JOB
// ===============================

frappe.ui.form.on("Repair Job", {

    setup(frm) {
        // Only show devices belonging to the selected customer
        frm.set_query("device", function () {
            return {
                filters: {
                    customer: frm.doc.customer
                }
            };
        });
    },

    service_charges(frm) {
        calculate_total(frm);
    },

    parts_used_add(frm) {
        calculate_total(frm);
    },

    parts_used_remove(frm) {
        calculate_total(frm);
    }

});


// ===============================
// REPAIR PART - CHILD TABLE
// ===============================

frappe.ui.form.on("Repair Part", {

    quantity(frm, cdt, cdn) {
        calculate_row(frm, cdt, cdn);
    },

    unit_price(frm, cdt, cdn) {
        calculate_row(frm, cdt, cdn);
    }

});


// ===============================
// CALCULATE CHILD ROW AMOUNT
// ===============================

function calculate_row(frm, cdt, cdn) {

    let row = locals[cdt][cdn];

    row.amount =
        (row.quantity || 0) *
        (row.unit_price || 0);

    frm.refresh_field("parts_used");

    calculate_total(frm);
}


// ===============================
// CALCULATE REPAIR JOB TOTAL
// ===============================

function calculate_total(frm) {

    let parts_total = 0;

    (frm.doc.parts_used || []).forEach(row => {
        parts_total += row.amount || 0;
    });

    frm.set_value("parts_total", parts_total);

    let grand_total =
        parts_total +
        (frm.doc.service_charges || 0);

    frm.set_value("grand_total", grand_total);
}