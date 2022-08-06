import React, { useState, useEffect } from "react"

import { connect } from "react-redux"
import {
  IonButton,
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonModal,
  IonLoading,
  IonLabel,
  IonList,
  IonItem,
  IonInput,
  IonText,
} from "@ionic/react"
import { doUpdateAccount, doDeleteAccount } from "../actions/authActions"

type Props = {
  dispatch
  user
  loading
  error
}

const Account: React.FC<Props> = ({ dispatch, user, loading, error }) => {
  const [edit, setEdit] = useState(false)
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  function handleConfirmDeleteAccount(email: string) {
    if (email === user.email) {
      setConfirmDeleteAccount(true)
    } else {
      setConfirmDeleteAccount(false)
    }
  }

  function handleUpdateAccount() {
      dispatch(
        doUpdateAccount(
          {
            firstName,
            lastName,
            email,
            password,
          }
        )
      )
  }

  function handleDeleteAccount() {
    dispatch(doDeleteAccount(user.id))
  }

  useEffect(() => {
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setEmail(user.email)
    setPassword("")
    setConfirmPassword("")
  }, [user])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {error ? (
          <IonItem>
            <IonText color="danger">{error}</IonText>
          </IonItem>
        ) : null}
        <IonList>
          <IonItem>
            <IonLabel>First Name:</IonLabel>
            <IonInput
              onIonChange={(e) => setFirstName(e.detail.value!)}
              disabled={!edit}
              value={firstName}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>Last Name:</IonLabel>
            <IonInput
              onIonChange={(e) => setLastName(e.detail.value!)}
              disabled={!edit}
              value={lastName}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>Password:</IonLabel>
            <IonInput
              onIonChange={(e) => setPassword(e.detail.value!)}
              disabled={!edit}
              type="password"
              value={password}
            ></IonInput>
          </IonItem>
          {edit ? (
            <IonItem>
              <IonLabel>Confirm password:</IonLabel>
              <IonInput
                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                disabled={!edit}
                type="password"
                value={confirmPassword}
              ></IonInput>
            </IonItem>
          ) : null}
        </IonList>
        <IonButton
          onClick={() => {
            if (edit) {
              handleUpdateAccount()
            }
            setEdit(!edit)
          }}
          color="primary"
          expand="full"
          shape="round"
        >
          {edit ? "Save" : "Edit"}
        </IonButton>
        <IonLoading isOpen={loading} message={"Working..."} />
      </IonContent>
    </IonPage>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  loading: state.user.loading,
  error: state.user.error,
})

export default connect(mapStateToProps)(Account)
