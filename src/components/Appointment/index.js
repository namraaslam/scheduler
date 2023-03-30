import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode";
import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(response => {
      transition(SHOW)
    })
  }

  function cancel(name, interviewer) {
    const interview = null;
    transition(DELETING);
    props.cancelInterview(props.id, interview)
    .then(response => {
      transition(EMPTY)
    })
  }


  console.log("props.interview",props.interview)

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
       {mode === CREATE && (<Form interviewers={props.interviewers} onCancel={back} onSave={save} />)}
       {mode === SAVING && <Status message={"Saving"}/>}
       {mode === DELETING && <Status message={"Deleting"}/>}
       {mode === CONFIRM && <Confirm onConfirm={cancel} onCancel={back}/>}
       {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interviewers}
          interviewers={props.interview.interviewer.id}
          onCancel={back} onSave={save}
        />
      )}
    </article>
  );
}
