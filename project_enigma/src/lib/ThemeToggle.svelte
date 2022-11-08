<script>
  import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
  import Button from "./Button.svelte";
  let icon = faCircleHalfStroke;

  export let toggle = () => {
    document.documentElement.classList.toggle("dark");
    window.document.body.classList.toggle("dark");
  };
</script>

<div class="container">
  <Button
    onclick={toggle}
    variant={"default alternate"}
    status={"active"}
    size={"lg"}
    outline={"outline"}
    {icon}
    shape={"circle"}
  />
</div>

<style>
  div {
    position: fixed;
    right: 25px;
    bottom: 50px;
  }
</style>
