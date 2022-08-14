// Copyright (c) 2022, Precihole and contributors
// For license information, please see license.txt

frappe.ui.form.on('QA Inspection',  {
    validate: function(frm,cdt,cdn) {
    if(cur_frm.doc.item !==undefined){
            if (cur_frm.doc.item.length !==0) {
                var rework=0;
                var scrap=0;
    
                for (var i = 0; i < cur_frm.doc.item.length; i++) {
                    var type=cur_frm.doc.item[i].type;
                   
                    if(type==="Rework"){
                        rework += cur_frm.doc.item[i].qty;
                    }
                    if(type==="Scrap"){
                        scrap += cur_frm.doc.item[i].qty;
                    }
                
                cur_frm.set_value('total_rework',rework );
                cur_frm.set_value('total_reject',scrap );

                
                }
    
          }
          else{
              cur_frm.set_value('total_rework',0 );
              cur_frm.set_value('total_reject',0 );
          }
    }
    //total accepted qty is rej+rew-rec
    var accepted_val = cur_frm.doc.total_received_qty - cur_frm.doc.total_rework -cur_frm.doc.total_reject ;
    cur_frm.set_value('total_accepted_qty',accepted_val);

    } 
});

// frappe.ui.form.on('Quality NC Entry Item', {
// 	qty: function(frm,cdt,cdn) {
// 		var d = locals[cdt][cdn];
// 		console.log(d.received_qty-d.qty)
// 		    d.accepted_qty = d.received_qty-d.qty
//             cur_frm.refresh_field("item");
// 	}
// })
// frappe.ui.form.on('Quality NC Entry Item', {
// 	type: function(frm,cdt,cdn) {
// 		var d = locals[cdt][cdn];
// 		if(d.type=="Rework"){
// 		    if(d.source_warehouse=="Stores A197 (Material In) - PSPL" || d.source_warehouse=="Stores A197 - PSPL"){
// 		        d.target_warehouse = "197 - Stores Not Good - PSPL"
// 		        cur_frm.refresh_field("item");
// 		    }
// 		    else if(d.source_warehouse=="Stores A272 (Material In) - PSPL"){
// 		        d.target_warehouse = "272 - Stores Not Good - PSPL"
// 		        cur_frm.refresh_field("item");
// 		    }
// 		}
// 		else if(d.type=="Scrap"){
// 	        d.target_warehouse = "Scrap - PSPL"   
// 	        cur_frm.refresh_field("item");
// 		}
// 		if(cur_frm.doc.non_conformance_source == "Assembly Component"){
// 		    if(d.type=="Scrap"){
// 		        d.source_warehouse = "WIP Assembly - PSPL"
// 		        d.target_warehouse = "Scrap - PSPL"
// 		        cur_frm.refresh_field("item");
// 		    }
// 		    else if(d.type=="Rework"){
// 		        d.source_warehouse = "WIP Assembly - PSPL"
// 		        d.target_warehouse = "272 - Stores Not Good - PSPL"
// 		        cur_frm.refresh_field("item");
// 		    }
// 		}
// 	}
// })
frappe.ui.form.on('Quality Inspection Item', {

  item_add: function(frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    
    child.item_code = frm.doc.item[0].item_code
    child.conversion_factor = frm.doc.item[0].conversion_factor
    child.get_hsn_code = frm.doc.item[0].get_hsn_code
    child.source_warehouse = frm.doc.item[0].source_warehouse
    
 
  }});
// frappe.ui.form.on('QA Inspection', {
// 	required_by_date:function(frm) {
//         var item_child=frm.doc.consumables_items
        

//         var item_child=frm.doc.consumables_items
//         for(var i=0;i<item_child.length;i++){
//             item_child[i].required_by_date = frm.doc.required_by_date
//             frm.refresh_field("consumables_items");
//         }
        
// 	}
// });
//================================Naming Series set here==========================
// frappe.ui.form.on('QA Inspection','non_conformance_source',function(frm, cdt, cdn){
// 	if (frm.doc.non_conformance_source == "Incoming") {
//         frm.set_value("naming_series", "QA-IN2223-.####");

//     }
//     else if(frm.doc.non_conformance_source == "Machine Shop"){
//         frm.set_value("naming_series", "QA-MS2223-.####");

//     }
//     else if(frm.doc.non_conformance_source == "Assembly Component"){
//         frm.set_value("naming_series", "QA-AC2223-.####");

//     }
//     else{
//         frm.set_value("naming_series", "");
//     }

// });

// //Remove rows when qty in zero
// frappe.ui.form.on('QA Inspection', {
// 	on_submit:function(cur_frm) {
//         var item_child=cur_frm.doc.item
//         for(var i=0;i<item_child.length;i++){
//             if(item_child[i].qty == 0){
//                 console.log(item_child[i].qty)
//                 cur_frm.get_field("item").grid.grid_rows[i].remove()
//                 cur_frm.save("Update")
//             }
//         }
// 	}
// });
// frappe.ui.form.on('QA Inspection',  {
//     validate: function(frm) {
//         var child = frm.doc.item
//         for(var i=0;i<child.length;i++){
//             var re = new RegExp('/');
//             var test = child[i].details
//             if(test.match(re)) {
//                 msgprint('you cannot use / in details');
//                 validated = false;
//             }
//         }
//     } 
// });
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
        var project_no_validate = new RegExp("(^[A-Z]{1}-[A-Z]{1}[0-9]{2,4})$");
        if (project_no_validate.test(project_no) === false){
            frappe.msgprint(__("Project number format is incorrect"));
            frappe.validated = false;
        }
    }

});


