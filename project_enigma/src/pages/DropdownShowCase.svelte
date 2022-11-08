<script>
  import Dropdown from "../lib/Dropdown.svelte";
  let variants = ["default", "primary", "secondary", "danger"];
  let sizes = ["sm", "md", "lg"];
  let statuses = ["active", "disabled"];
  let options = ["Option 1", "Option 2", "Option 3"];
</script>

<main>
  <!--   Dropdown Showcase -->
  {#each variants as variant}
    <column>
      <div style="margin-bottom: 20px">
        {#each statuses as status}
          <row>
            {#each sizes as size}
              <div style="margin-right: 20px; margin-top: 10px">
                <Dropdown {variant} {status} {size} {options} />
              </div>
            {/each}
          </row>
        {/each}
      </div>
    </column>
  {/each}
</main>

<style>
  row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  column {
    margin-right: 10px;
  }
</style>
