// Copyright (c) 2022, Precihole and contributors
// For license information, please see license.txt
//
frappe.ui.form.on('Quality Inspection Item', {

  item_add: function(frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    
    child.item_code = frm.doc.item[0].item_code
    child.conversion_factor = frm.doc.item[0].conversion_factor
    child.get_hsn_code = frm.doc.item[0].get_hsn_code
    child.source_warehouse = frm.doc.item[0].source_warehouse
    
 
  }});

//========getting issue while amend doc is creating when cancel remark is entered...cancel remak field is copy in amend doc also===========
frappe.ui.form.on('QA Inspection',  {
    refresh: function(frm) {
        if(frm.doc.__islocal && frm.doc.amended_from){
            frm.set_value("cancel_remark","")
        }
    } 
});
//================================================for next day validation===================================================================
frappe.ui.form.on("QA Inspection", "validate", function(frm) {
    if ((frm.doc.date > frappe.datetime.now_datetime()) || (frm.doc.date < "2022-04-01 00:00:00"))  {
        frappe.msgprint(__("You can not select future date in Date"));
        frappe.validated = false;
    }
});
// ADDING CUSSTOM BUTTON AND ROUTING  
frappe.ui.form.on('QA Inspection',  {
    refresh: function(frm) {
        if(frm.doc.docstatus == 0 || frm.doc.__islocal){
            cur_frm.set_value("user_name",frappe.session.user_fullname)
        }
    	cur_frm.add_custom_button(__("Create Non Conformance"), function() {
            frappe.route_options = {
        	    'refrence__no': frm.doc.name
        	};
        	document = frappe.new_doc("Non Conformance");
        	frappe.set_route('Form','Non Conformance',document.name);
        });
    } 
});
//=======================================UPLOADING DATA ON DRIVE=============================================
frappe.ui.form.on('QA Inspection', {
    refresh(frm){
    if(!cur_frm.doc.__islocal){
        frm.set_df_property("upload_file", "options", `
            <div style="border: 1px solid rgb(201, 0, 1); overflow: hidden; margin: 15px auto; max-width: 900px;">
<iframe scrolling="no" src="https://script.google.com/a/macros/preciholesports.com/s/AKfycbzKzTjQc58bzcjWssH87ZwOOuTk9uz4iog9leA1qYrdN7wznKk/exec?docType=`+cur_frm.doc.doctype+`&formId=`+ cur_frm.doc.name +`" style="border: 0px none;height: 450px; width: 900px;">
</iframe>
</div>
            `); 
        }
        else{
            
            frm.set_df_property("attach_c","hidden",1);
            frm.set_df_property("upload_file","hidden",1);
        
        }
    }
        
});
//Filtering machine list
frappe.ui.form.on('QA Inspection', {
	non_conformance_source: function(frm) {
	    if (cur_frm.doc.non_conformance_source == "Production"){
	        frm.set_query('machine_list', function() {
			return {
				'filters': {
					'machine_type': ['=', "Production"]
				}
			};
		});

	    }
	    else if(cur_frm.doc.non_conformance_source == "Tool Room"){
	        frm.set_query('machine_list', function() {
			return {
				'filters': {
					'machine_type': ['=', "Tool Room"]
				}
			};
		});

	    }

	},
    refresh: function(frm) {
	    if (cur_frm.doc.non_conformance_source == "Production"){
	        frm.set_query('machine_list', function() {
			return {
				'filters': {
					'machine_type': ['=', "Production"]
				}
			};
		});

	    }
	    else if(cur_frm.doc.non_conformance_source == "Tool Room"){
	        frm.set_query('machine_list', function() {
			return {
				'filters': {
					'machine_type': ['=', "Tool Room"]
				}
			};
		});

	    }

	},

});
// Validating project and omt no
frappe.ui.form.on("QA Inspection", "validate", function(frm){

var project_no = cur_frm.doc.project_no;
    if (project_no){
        if (cur_frm.doc.reference_doctype=="WORK ORDER"){
            var project_no_validate = new RegExp("^[0-9]+$");
            if (project_no_validate.test(project_no) === false){
                frappe.msgprint(__("Project number format is incorrect"));
                frappe.validated = false;
            }
        }else if (cur_frm.doc.reference_doctype == "PROJECT"){
            var project_no_validate = new RegExp("(^[A-Z]{1}-[A-Z]{1}[0-9]{2,4})$");
            if (project_no_validate.test(project_no) === false){
                frappe.msgprint(__("Project number format is incorrect"));
                frappe.validated = false;
            }
        }
        
    }

});
// Child table add event add item code if there is item already
frappe.ui.form.on('Quality Inspection Item', { 
    item_add(frm, cdt, cdn) { 
        var c = locals[cdt][cdn];
        c.item_code=cur_frm.doc.item_code;
    }
});
// for setting aprroved by department
// frappe.ui.form.on("Expense Claim", {
//     before_workflow_action: (frm) => {
//         console.log(frm.selected_workflow_action);
//         if (
//             frm.doc.workflow_state === "Advance Validated By Finance" &&
//             frm.selected_workflow_action === "Approve Advance Request" &&
//             frm.doc.checkbox_m == 1
//         ) {
//             frappe.throw("Please check the 'approval' checkbox before approving");
//             frappe.validated = false;
//         }
//     },
// });