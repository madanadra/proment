import TemplateUnauth from "../../_components/template_unauth";
import { sign_up } from "@/fetch";

export default function SignUpPage() {
    return (
      <TemplateUnauth title="Sign up" action={sign_up} 
      input={[
        {
          label: 'Username',
          type: 'text',
          name: 'username'
        }, {
          label: 'Password',
          type: 'password',
          name: 'password'
        }, {
          label: 'Password confirmation',
          type: 'password',
          name: 'password-confirmation'
        }
      ]} bottom="Already have an account?" url="/login" name="Log in" />
    );
}