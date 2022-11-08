<script>
  import Button from "./lib/Button.svelte";
  import ThemeToggle from "./lib/ThemeToggle.svelte";
  import Toggle from "./lib/Toggle.svelte";
  import Radio from "./lib/Radio.svelte";
  import Checkbox from "./lib/Checkbox.svelte";
  import {
    faPlay,
    faStop,
    faTrash,
    faEye,
    faEyeSlash,
    faEdit,
    faCopy,
  } from "@fortawesome/free-solid-svg-icons";

  import ButtonShowcase from "./pages/ButtonShowcase.svelte";
  let visibleButton = false;
  export let toggleButtonShowcase = () => {
    visibleButton = !visibleButton;
  };

  import DropdownShowcase from "./pages/DropdownShowCase.svelte";
  let visibleDropdown = false;
  export let toggleDropdownShowcase = () => {
    visibleDropdown = !visibleDropdown;
  };

  import ControlShowcase from "./pages/ControlShowcase.svelte";
  let visibleControls = false;
  export let toggleControlShowcase = () => {
    visibleControls = !visibleControls;
  };
</script>

<main>
  <ThemeToggle />
  <row>
    <column>
      {#if visibleButton}
        <Button
          variant="default"
          status="active"
          size="sm"
          outline="noOutline"
          text="Hide Button Showcase"
          icon={faEyeSlash}
          onclick={toggleButtonShowcase}
        />
      {:else}
        <Button
          variant="default"
          status="active"
          size="sm"
          outline="noOutline"
          text="Show Button Showcase"
          icon={faEye}
          onclick={toggleButtonShowcase}
        />
      {/if}

      {#if visibleDropdown}
        <Button
          variant="default"
          status="active"
          size="sm"
          outline="noOutline"
          text="Hide Dropdown Showcase"
          icon={faEyeSlash}
          onclick={toggleDropdownShowcase}
        />
      {:else}
        <Button
          variant="default"
          status="active"
          size="sm"
          outline="noOutline"
          text="Show Dropdown Showcase"
          icon={faEye}
          onclick={toggleDropdownShowcase}
        />
      {/if}

      {#if visibleControls}
        <Button
          variant="default"
          status="active"
          size="sm"
          outline="noOutline"
          text="Hide Control Showcase"
          icon={faEyeSlash}
          onclick={toggleControlShowcase}
        />
      {:else}
        <Button
          variant="default"
          status="active"
          size="sm"
          outline="noOutline"
          text="Show Control Showcase"
          icon={faEye}
          onclick={toggleControlShowcase}
        />
      {/if}
    </column>

    <div style="margin-right: 20px; margin-top: 10px">
      <Button
        variant={"secondary"}
        status={"active"}
        size={"md"}
        outline={"outline"}
        text="Start Tasks"
        icon={faPlay}
      />
    </div>

    <div style="margin-right: 20px; margin-top: 10px">
      <Button
        variant={"warning"}
        status={"active"}
        size={"md"}
        outline={"outline"}
        text="Stop Tasks"
        icon={faStop}
      />
    </div>

    <div style="margin-right: 20px; margin-top: 10px">
      <Button
        variant={"danger"}
        status={"active"}
        size={"md"}
        outline={"outline"}
        text="Delete Tasks"
        icon={faTrash}
      />
    </div>

    <div style="margin-right: 20px; margin-top: 10px">
      <Button
        variant={"default"}
        status={"active"}
        size={"md"}
        outline={"outline"}
        text="Edit Tasks"
        icon={faEdit}
      />
    </div>

    <div style="margin-right: 20px; margin-top: 10px">
      <Button
        variant={"default"}
        status={"active"}
        size={"md"}
        outline={"outline"}
        text="Duplicate Tasks"
        icon={faCopy}
      />
    </div>
  </row>

  {#if visibleControls}
    <ControlShowcase />
  {/if}

  {#if visibleButton}
    <ButtonShowcase />
  {/if}

  {#if visibleDropdown}
    <DropdownShowcase />
  {/if}
</main>

<style>
  row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>
