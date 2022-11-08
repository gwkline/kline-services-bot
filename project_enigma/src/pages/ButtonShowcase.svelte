<script>
  import Button from "../lib/Button.svelte";
  import Dropdown from "../lib/Dropdown.svelte";
  import ThemeToggle from "../lib/ThemeToggle.svelte";
  import { faStar, faPlay } from "@fortawesome/free-solid-svg-icons";

  let variants = [
    "default",
    "primary",
    "secondary",
    "danger",
    "success",
    "warning",
    "default alternate",
    "danger alternate",
    "success alternate",
    "warning alternate",
  ];
  let sizes = ["sm", "md", "lg"];
  let statuses = ["active", "disabled"];
  let outline = ["outline", "noOutline"];
</script>

<main>
  <!--   Button Showcase -->
  {#each outline as outline}
    <row>
      <column>
        {#each variants as variant}
          <div style="margin-bottom: 20px">
            {#each statuses as status}
              <row>
                {#each sizes as size}
                  <div style="margin-right: 20px; margin-top: 10px">
                    <Button
                      {variant}
                      {status}
                      {size}
                      {outline}
                      text={`${
                        variant[0].toUpperCase() + variant.substring(1)
                      } button`}
                      icon={""}
                    />
                  </div>
                {/each}
              </row>
            {/each}
          </div>
        {/each}
      </column>
      <column style="">
        {#each variants as variant}
          <div style="margin-bottom: 20px;">
            {#each statuses as status}
              <row>
                {#each sizes as size}
                  <div style="margin-right: 20px; margin-top: 10px">
                    <Button
                      {variant}
                      {status}
                      {size}
                      {outline}
                      text={`${
                        variant[0].toUpperCase() + variant.substring(1)
                      } button`}
                      icon={faPlay}
                    />
                  </div>
                {/each}
              </row>
            {/each}
          </div>
        {/each}
      </column>
      <column>
        {#each variants as variant}
          <div style="margin-bottom: 20px">
            {#each statuses as status}
              <row>
                {#each sizes as size}
                  <div style="margin-right: 20px; margin-top: 10px">
                    <Button
                      {variant}
                      {status}
                      {size}
                      {outline}
                      text=""
                      icon={faStar}
                    />
                  </div>
                {/each}
              </row>
            {/each}
          </div>
        {/each}
      </column>
    </row>
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
