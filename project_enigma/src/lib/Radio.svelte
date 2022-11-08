<script>
</script>

<form>
  <label style="margin-bottom: 10px;">
    <input type="radio" name="radio" checked />
    <span>Chrome</span>
  </label>
  <label style="margin-bottom: 10px;">
    <input type="radio" name="radio" />
    <span>Brave</span>
  </label>
  <label style="margin-right: 10px;">
    <input type="radio" name="radio" />
    <span>Edge</span>
  </label>
</form>

<style>
  form {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }

  label {
    display: flex;
    font-family: Roboto;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    color: var(--off-black);
  }
  label input {
    position: absolute;
    left: -9999px;
  }
  label input:checked + span {
    background-color: var(--light-gray-2);
  }
  label input:checked + span:before {
    box-shadow: inset 0 0 0 0.4375em var(--primary);
  }
  label span {
    display: flex;
    align-items: center;
    padding: 0.3em 0.75em 0.3em 0.3em;
    border-radius: 99em;
    transition: 0.25s ease;
  }
  label span:hover {
    background-color: var(--light-gray-2);
  }
  label span:before {
    display: flex;
    flex-shrink: 0;
    content: "";
    width: 1.3em;
    height: 1.3em;
    border-radius: 50%;
    margin-right: 0.375em;
    transition: 0.25s ease;
    box-shadow: inset 0 0 0 0.125em var(--light-gray-3);
  }
</style>
