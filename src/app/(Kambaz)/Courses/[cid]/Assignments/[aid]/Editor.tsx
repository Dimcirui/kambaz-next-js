export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to Kanbas application
        Links to all relevant source code repositories
        The Kanbas application should include a link to navigate back to the landing page.
      </textarea>
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" defaultValue={100} />
          </td>
        </tr>
        {/* Complete on your own */}
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-group">Assignment Group</label>
          </td>
          <td>
            <select id="wd-group">
                <option value="assignments" selected>ASSIGNMENTS</option>
                <option value="quizzes">QUIZZES</option>
                <option value="exams">EXAMS</option>
            </select>
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-display-grade-as">Display Grade as</label>
          </td>
          <td>
            <select id="wd-display-grade-as">
                <option value="percentage" selected>Percentage</option>
                <option value="value">VALUE</option>
                <option value="rank">RANK</option>
            </select>
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-type">Submission Type</label>
          </td>
          <td>
            <select id="wd-submission-type">
                <option value="online" selected>Online</option>
                <option value="on-paper">On Paper</option>
            </select>
          </td>
        </tr>
      </table>

      <div>
          <h4>Online Entry Options</h4>
          <div style={{ paddingLeft: '20px' }}>
          <label><input type="checkbox" name="online-entry-options" id="wd-text-entry" value="text-entry" /> Text Entry</label><br />
          <label><input type="checkbox" name="online-entry-options" id="wd-website-url" value="website-url" defaultChecked /> Website URL</label><br />
          <label><input type="checkbox" name="online-entry-options" id="wd-media-recordings" value="media-recordings" /> Media Recordings</label><br />
          <label><input type="checkbox" name="online-entry-options" id="wd-student-annotation" value="student-annotation" /> Student Annotation</label><br />
          <label><input type="checkbox" name="online-entry-options" id="wd-file-upload" value="file-uploads" /> File Uploads</label><br />
          </div>
      </div>

      <br />
      <br />
      <label htmlFor="wd-assign-to">Assign Assign to</label><br />
      <input id="wd-assign-to" defaultValue="Everyone" /><br />
      <br />
      <label htmlFor="wd-due-date">Due</label><br />
      <input id="wd-due-date" type="date" defaultValue="2024-05-13" /><br />
      <br />
      <label htmlFor="wd-available-from">Available from</label><br />
      <input id="wd-available-from" type="date" defaultValue="2024-05-06" /><br />
      <br />
      <label htmlFor="wd-available-until">Until</label><br />
      <input id="wd-available-until" type="date" defaultValue="2024-05-20" /><br />
      <br />

      <div style={{ textAlign: 'right' }}>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </div>
);}
