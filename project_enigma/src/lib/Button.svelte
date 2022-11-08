<script>
  import Fa from "svelte-fa";

  export let variant = "default";
  export let status = "active";
  export let size = "md";
  export let icon = null;
  export let text = "";
  export let outline = "outline";
  export let shape = null;
  export let onclick = null;
  export let alternate = null;
</script>

<div class="container">
  {#if icon !== "" && text !== ""}
    <button
      class="{variant} {size} {status} {outline} {shape} {alternate}"
      on:click={onclick}
    >
      <row>
        {#if icon !== "" && size !== "xs"}
          <Fa {icon} style="margin-right: .5rem" />
        {:else if icon !== ""}
          <Fa {icon} />
        {/if}

        {#if size !== "xs" && text !== ""}
          {text}
        {/if}
      </row>
    </button>
  {:else if icon === "" && text !== ""}
    <button
      class="{variant} {size} {status} {outline} {shape} {alternate}"
      on:click={onclick}
    >
      <row>
        {#if size !== "xs" && text !== ""}
          {text}
        {/if}
      </row>
    </button>
  {:else if icon !== "" && text === ""}
    <button
      class="{variant} {size} {status} {outline} iconOnly {shape} {alternate}"
      on:click={onclick}
    >
      <div style="margin: 0 auto;">
        <Fa {icon} />
      </div>
    </button>
  {/if}
</div>

<style>
  row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .container {
    display: flex;
    justify-content: center; /* center horizontally */
    align-items: center; /* center vertically */
    height: 50%;
    text-align: center; /* needed if the text wraps */
  }

  button {
    /* Auto layout */
    width: auto;
    height: auto;
    font-family: inherit;
    display: inline-flex;
    border: 1px solid transparent;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 7px;
  }

  button.danger.active:active {
    background: #79071a;
  }

  /* Icon-only sizing */

  button.iconOnly.sm {
    padding: 7px 7px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  button.iconOnly.md {
    padding: 10px 10px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  button.iconOnly.lg {
    padding: 15px 15px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  button.outline {
    border-color: var(--light-gray-4);
    border-width: 1px;
    border-style: solid;
    box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04);
  }

  button.sm {
    font-weight: 500;
    font-size: 13px;
    padding: 3px 15px;
  }

  button.md {
    font-weight: 500;
    font-size: 14px;
    padding: 6px 20px;
  }

  button.lg {
    font-size: 15px;
    font-weight: 700;
    padding: 10px 25px;
  }

  button.circle {
    border-radius: 50%;
  }

  button.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* Color Settings */

  button.default {
    background: var(--background);
    color: var(--off-black);
  }

  button.primary {
    background: var(--primary);
    color: var(--white);
  }

  button.secondary {
    background: var(--background);
    color: var(--primary);
  }

  button.danger {
    background: var(--background);
    color: var(--danger-red);
  }

  button.success {
    background: var(--background);
    color: var(--success-green);
  }

  button.warning {
    background: var(--background);
    color: var(--warning-yellow);
  }

  button.default.alternate {
    color: var(--background);
    background: var(--off-black);
  }

  button.danger.alternate {
    color: var(--background);
    background: var(--danger-red);
  }

  button.success.alternate {
    color: var(--background);
    background: var(--success-green);
  }

  button.warning.alternate {
    color: var(--background);
    background: var(--warning-yellow);
  }

  button.default.active:hover,
  button.secondary.active:hover,
  button.success.active:hover,
  button.warning.active:hover {
    background: var(--light-gray-2);
  }

  button.primary.active:hover {
    background: var(--primary-hover);
  }

  button.danger.active:hover {
    background: var(--danger-red-hover);
    color: var(--white);
  }

  button.default.alternate.active:hover {
    background: var(--gray);
  }

  button.danger.alternate.active:hover {
    background: var(--danger-red-hover);
  }

  button.success.alternate.active:hover {
    background: var(--success-green-hover);
  }

  button.warning.alternate.active:hover {
    background: var(--warning-yellow-hover);
  }

  /* Click Indication */
  button.default.active:active,
  button.secondary.active:active,
  button.success.active:active,
  button.warning.active:active {
    transition: 0s;
    -webkit-box-shadow: inset 0px 0px 5px #b6b6b6;
    -moz-box-shadow: inset 0px 0px 5px #b6b6b6;
    box-shadow: inset 0px 0px 5px #b6b6b6;
    outline: none;
  }

  button.primary.active:active,
  button.danger.active:active {
    transition: 0s;
    -webkit-box-shadow: inset 0px 0px 7px #000e30;
    -moz-box-shadow: inset 0px 0px 7px #000e30;
    box-shadow: inset 0px 0px 7px #000e30;
    outline: none;
  }
</style>
