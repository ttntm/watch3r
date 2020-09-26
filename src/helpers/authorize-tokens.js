/*
Extract and validate tokens in the URL if they are present.
*/
import store from '@/store';
import router from '@/router';

/**
 * Reads the URL hash attempts and tries to detect if there is confirmation tokens from an email signup or
 * invite. If present it will call the relevant process to attempt to authorize the token.
 */
function detectTokens() {
  const emailToken = detectEmailConfirmationToken();
  const inviteToken = detectInviteToken();
  const recoveryToken = detectRecoveryToken();

  if (emailToken) {
    console.log("Detected email confirmation token", emailToken);
    confirmEmailToken(emailToken);
    return;
  } else if (inviteToken) {
    console.log("found invite token", inviteToken);
    confirmInviteToken(inviteToken);
    return;
  } else if (recoveryToken) {
    console.log("found recovery token", recoveryToken);
    confirmRecoveryToken(recoveryToken);
    return;
  }
}

/**
 * Checks URL hash for `confirmation_token=` then extracts the token which proceeds.
 */
function detectEmailConfirmationToken() {
  try {
    // split the hash where it detects `confirmation_token=`. The string which proceeds is the part which we want.
    const token = decodeURIComponent(document.location.hash).split(
      "confirmation_token="
    )[1];
    return token;
  } catch (error) {
    console.error(
      "Something went wrong when trying to extract email confirmation token",
      error
    );
    return null;
  }
}

function detectInviteToken() {
  try {
    // split the hash where it detects `invite_token=`. The string which proceeds is the part which we want.
    const token = decodeURIComponent(document.location.hash).split(
      "invite_token="
    )[1];
    return token;
  } catch (error) {
    console.error(
      "Something went wrong when trying to extract invite token.",
      error
    );
    return null;
  }
}

function detectRecoveryToken() {
  try {
    // split the hash where it detects `confirmation_token=`. The string which proceeds is the part which we want.
    const token = decodeURIComponent(document.location.hash).split(
      "recovery_token="
    )[1];
    return token;
  } catch (error) {
    console.error(
      "Something went wrong when trying to extract recovery token.",
      error
    );
    return null;
  }
}

/**
 * @param {string} token - authentication token used to confirm a user who has created an account via email signup.
 */
function confirmEmailToken(token) {
  let msg = { text: '', type: '' };
  store
    .dispatch("user/attemptConfirmation", token)
    .then(resp => {
      msg.text = `${resp.email} has been confirmed, please login`;
      msg.type = 'success';
      store.dispatch('app/sendToastMessage', msg);
    })
    .catch(error => {
      msg.text = `Can't authorize your account right now. Please try again`;
      msg.type = 'error';
      store.dispatch('app/sendToastMessage', msg);
      console.error(error, "Something's gone wrong confirming user");
    });
}

function confirmInviteToken(token) {
  let msg = { text: '', type: '' };
  router.push(`/signup?t=${token}`);
  msg.text = `Invite token found, please fill the form to complete your signup`;
  msg.type = 'info';
  store.dispatch('app/sendToastMessage', msg);
}

function confirmRecoveryToken(recoveryToken) {
  store
    .dispatch("user/attemptPasswordRecovery", recoveryToken)
    .then(() => {
      // router.push("profile?showUpdateUserModal=true");
      alert("Account has been recovered. Update your password now.");
    })
    .catch(() => {
      alert(`Can't recover password`);
    });
}

export default function () {
  detectTokens();
}