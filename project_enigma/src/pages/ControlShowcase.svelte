<script>
  import Toggle from "../lib/Toggle.svelte";
  import Radio from "../lib/Radio.svelte";
  import Checkbox from "../lib/Checkbox.svelte";
</script>

<main>
  <row>
    <column>
      <div style="margin-bottom: 10px;">
        <Toggle variant={"success"} />
      </div>
      <div style="margin-right: 10px;">
        <Toggle />
      </div>
    </column>

    <Radio />
    <Checkbox />
  </row>
</main>

<style>
  row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>
