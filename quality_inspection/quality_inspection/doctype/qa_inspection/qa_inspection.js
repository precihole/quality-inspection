// Copyright (c) 2022, Precihole and contributors
// For license information, please see license.txt
frappe.ui.form.on('QA Inspection',  {
    validate: function(frm,cdt,cdn) {
    if(cur_frm.doc.item !==undefined){
            if (cur_frm.doc.item.length !==0) {
                var rework=0,scrap=0,deviation=0;
    
                for (var i = 0; i < cur_frm.doc.item.length; i++) {
                    var type=cur_frm.doc.item[i].type;
                   
                    if(type==="Rework"){
                        rework += cur_frm.doc.item[i].qty;
                    }
                    else if(type==="Reject"){
                        scrap += cur_frm.doc.item[i].qty;
                    }
                    else if(type==="Deviation"){
                        deviation += cur_frm.doc.item[i].qty;
                    }
                
                cur_frm.set_value('total_rework',rework );
                cur_frm.set_value('total_reject',scrap );
                cur_frm.set_value('total_deviation',deviation);

                
                }
    
          }
          else{
              cur_frm.set_value('total_rework',0 );
              cur_frm.set_value('total_reject',0 );
              cur_frm.set_value('total_deviation',0);
          }
    }
    //total accepted qty is rej+rew-rec
    var accepted_val = cur_frm.doc.total_received_qty - cur_frm.doc.total_rework - cur_frm.doc.total_reject - cur_frm.doc.total_deviation;
    console.log(accepted_val)
    cur_frm.set_value('total_accepted_qty',accepted_val);

    } 
});
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
        if(frm.doc.amended_from){
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
frappe.ui.form.on('QA Inspection',  {
    vibrate: function(frm) {
// To check that is vibration API supported
if (navigator.vibrate) {
    window.navigator.vibrate(200);
}
    } 
});

// ADDING CUSSTOM BUTTON AND ROUTING  
frappe.ui.form.on('QA Inspection',  {
    refresh: function(frm) {
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
        if (cur_frm.doc.reference_doctype=="Work Order"){
            var project_no_validate = new RegExp("^[0-9]+$");
            if (project_no_validate.test(project_no) === false){
                frappe.msgprint(__("Project number format is incorrect"));
                frappe.validated = false;
            }
        }else{
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
