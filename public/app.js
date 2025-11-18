//toggle role
function updateRoleView(role) {
    //hide sections unrelated
    document.querySelectorAll('section[data-role="student"], section[data-role="recruiter"]').forEach(s => {
        s.style.display = "none";
    });
    //show related role sections
    document.querySelectorAll(`section[data-role="${role}"]`).forEach(s => {
        s.style.display = "";
    });
}

const roleRadios = document.querySelectorAll('input[name="role"]');
    roleRadios.forEach(r => {
        r.addEventListener("change", e => updateRoleView(e.target.value));
    });
  
    updateRoleView(document.querySelector('input[name="role"]:checked').value);
  
async function getJSON(path, opts) {
    const res = await fetch(path, opts);
    const data = await res.json().catch(() => ({})); 
    if (!res.ok) throw new Error(data.error || res.statusText);
    return data;
}

async function getJSON(path, opts) {
    const res = await fetch(path, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || res.statusText);
    return data;
}
  
const out = document.getElementById("output");
  
document.getElementById("loadCompanies").onclick = async () => {
    out.textContent = "Loading companies…";
    out.textContent = JSON.stringify(await getJSON("/companies"), null, 2);
};
document.getElementById("loadRecruiters").onclick = async () => {
    out.textContent = "Loading recruiters…";
    out.textContent = JSON.stringify(await getJSON("/recruiters"), null, 2);
};
document.getElementById("loadJobs").onclick = async () => {
    out.textContent = "Loading jobs…";
    out.textContent = JSON.stringify(await getJSON("/jobs"), null, 2);
};
document.getElementById("loadApplications").onclick = async () => {
    out.textContent = "Loading applications…";
    out.textContent = JSON.stringify(await getJSON("/applications"), null, 2);
};
document.getElementById("loadStudents").onclick = async () => {
    out.textContent = "Loading students…";
    out.textContent = JSON.stringify(await getJSON("/students"), null, 2);
};
  
document.getElementById("addStudent").onclick = async () => {
    const body = {
        name: document.getElementById("sName").value,
        email: document.getElementById("sEmail").value,
        major: document.getElementById("sMajor").value,
        resume: document.getElementById("sResume").value,
        university_name: document.getElementById("sUniv").value,
        skills: document.getElementById("sSkills").value
    };
    try {
        const res = await getJSON("/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        out.textContent = "✅ " + JSON.stringify(res);
    } catch (e) {
        out.textContent = "❌ " + e.message;
    }
};
  
document.getElementById("addApplication").onclick = async () => {
    const body = {
        student_id: Number(document.getElementById("aStudentId").value),
        job_id: Number(document.getElementById("aJobId").value),
    };
    try {
        const res = await getJSON("/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        out.textContent = "✅ " + JSON.stringify(res);
    } catch (e) {
        out.textContent = "❌ " + e.message;
    }
};

// Recruiter: Post a Job
document.getElementById("postJob").onclick = async () => {
    const body = {
      title: document.getElementById("jTitle").value,
      description: document.getElementById("jDesc").value,
      requirements: document.getElementById("jReqs").value,
      location: document.getElementById("jLoc").value,
      salary: Number(document.getElementById("jSalary").value || 0),
      deadline: document.getElementById("jDeadline").value, // 'YYYY-MM-DD'
      status: document.getElementById("jStatus").value || "Open",
      company_id: Number(document.getElementById("jCompanyId").value),
      recruiter_id: Number(document.getElementById("jRecruiterId").value)
    };
  
    try {
      const res = await getJSON("/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      out.textContent = "✅ " + res.message;
    } catch (e) {
      out.textContent = "❌ " + e.message;
    }
  };
  
  // Recruiter: Update Application Status
  document.getElementById("updateApplicationStatus").onclick = async () => {
    const id = Number(document.getElementById("applId").value);
    const status = document.getElementById("applStatus").value;
  
    const body = { status, withdrawn_flag: false }; // matches your PUT /applications/:id
  
    try {
      const res = await getJSON(`/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      out.textContent = "✅ " + res.message;
    } catch (e) {
      out.textContent = "❌ " + e.message;
    }
  };
  