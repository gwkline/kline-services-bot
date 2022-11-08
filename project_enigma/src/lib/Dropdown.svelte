<script>
  export let variant;
  export let status;
  export let size;
  export let options;
</script>

<div class="container">
  <select class="{variant} {size} {status} outline">
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
</div>

<style>
  .container {
    display: flex;
    justify-content: center; /* center horizontally */
    align-items: center; /* center vertically */
    height: 50%;
    text-align: center; /* needed if the text wraps */
  }

  select {
    transition: 0.45s;
    width: auto;
    font-family: inherit;
    display: inline-flex;
    border: 1px solid transparent;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
    box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04);
    border-radius: 7px;
    padding: 5px 10px;
  }

  select option:checked,
  select option:hover {
    box-shadow: 0 0 10px 100px #000 inset;
  }

  select.outline {
    border-color: var(--light-gray-4);
    border-width: 1px;
    border-style: solid;
  }

  select.sm {
    font-weight: 500;
    font-size: 13px;
    height: 28px;
  }

  select.md {
    font-weight: 500;
    font-size: 14px;
    height: 32px;
  }

  select.lg {
    font-size: 15px;
    font-weight: 600;
    height: 40px;
  }

  select.disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  select.default {
    background: var(--background);
    color: var(--off-black);
  }

  select.primary {
    background: var(--primary);
    color: var(--white);
  }

  select.secondary {
    background: var(--background);
    color: var(--primary);
  }

  select.danger {
    background: var(--background);
    color: var(--danger-red);
  }
</style>
