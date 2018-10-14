$(function() {
    $("#send_request_form").submit(function(e) {
        e.preventDefault();
        const payload = {
            to: $("#toemail").val(),
            cc: $("#ccemail").val(),
            bcc: $("#bccemail").val(),
            subject: $("#subject").val(),
            text: $("#comments").val()
        };
        $("#submit_review").attr("disabled", true);
        fetch("/email", { method: "POST", body: JSON.stringify(payload) })
            .then(response => {
                if (response.status === 400) {
                    $("#error_message").addClass("text-danger");
                    $("#error_message").show();
                    $("#send_request_form").show();
                    $("#invite-message").show();
                    $("#submit_review").attr("disabled", false);
                    $("#success_message").removeClass("text-success");
                    setTimeout(() => {
                        $("#error_message").hide();
                        $("#subject").removeClass("is-invalid");
                        $("#comments").removeClass("is-invalid");
                        $("#toemail").removeClass("is-invalid");
                        $("#ccemail").removeClass("is-invalid");
                        $("#bccemail").removeClass("is-invalid");
                    }, 3000);
                } else {
                    $("#success_message").addClass("text-success");
                    $("#error_message").removeClass("text-danger");
                    $("#success_message").show();
                    $("#invite-message").hide();
                    $("#send_request_form").hide();
                    setTimeout(() => {
                        $("#success_message").hide();
                        $("#invite-message").show();
                        $("#send_request_form").show();
                        $("#submit_review").attr("disabled", false);
                        $("#subject").removeClass("is-invalid");
                        $("#comments").removeClass("is-invalid");
                        $("#toemail").removeClass("is-invalid");
                        $("#ccemail").removeClass("is-invalid");
                        $("#bccemail").removeClass("is-invalid");
                    }, 3000);
                }
                return response.json();
            })
            .then(data => {
                if (data.subject) {
                    $("#subject").addClass("is-invalid");
                    $("#subject").after(
                        `<small className="form-text text-muted is-invalid">${
                            data.subject
                        }</small>`
                    );
                }
                if (data.comments) {
                    $("#comments").addClass("is-invalid");
                    $("#comments").after(
                        `<small className="form-text text-muted is-invalid">${
                            data.comments
                        }</small>`
                    );
                }
                if (data.toemail) {
                    $("#toemail").addClass("is-invalid");
                    $("#toemail").after(
                        `<small className="form-text text-muted is-invalid">${
                            data.toemail
                        }</small>`
                    );
                }
                if (data.ccemail) {
                    $("#ccemail").addClass("is-invalid");
                    $("#ccemail").after(
                        `<small className="form-text text-muted is-invalid">${
                            data.ccemail
                        }</small>`
                    );
                }
                if (data.bccemail) {
                    $("#bccemail").addClass("is-invalid");
                    $("#bccemail").after(
                        `<small className="form-text text-muted is-invalid">${
                            data.bccemail
                        }</small>`
                    );
                }
                setTimeout(() => {
                    $("small").remove();
                    $("#subject").removeClass("is-invalid");
                    $("#comments").removeClass("is-invalid");
                    $("#toemail").removeClass("is-invalid");
                    $("#ccemail").removeClass("is-invalid");
                    $("#bccemail").removeClass("is-invalid");
                }, 3000);
            });
    });
});
