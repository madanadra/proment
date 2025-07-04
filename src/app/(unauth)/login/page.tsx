import { log_in } from "@/fetch";
import TemplateUnauth from "../../_components/template_unauth";

export default function LogInPage() {
    return (
      <TemplateUnauth title="Log in" action={log_in} 
      input={[
        {
          label: 'Username',
          type: 'text',
          name: 'username'
        }, {
          label: 'Password',
          type: 'password',
          name: 'password'
        }
      ]} bottom="Don't have an account?" url="/signup" name="Sign up" />
    );
  }