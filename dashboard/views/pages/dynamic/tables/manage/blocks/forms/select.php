<?php if ($module->columns[$i]->type_column == "select"): ?>

	<?php if ($module->columns[$i]->title_column != "font_admin"): ?>

	<div class="input-group mb-3">
		
		<input 
		type="text"
		class="form-control rounded changeSelectType tags-input"
		idColumn="<?php echo $module->columns[$i]->id_column ?>"
		titleColumn="<?php echo $module->columns[$i]->title_column ?>"
		value="<?php echo $module->columns[$i]->matrix_column ?>"
		preValue="<?php if (!empty($data)): ?><?php echo htmlspecialchars(urldecode($data[$module->columns[$i]->title_column]), ENT_QUOTES, 'UTF-8'); ?><?php endif ?>"
		>
	</div>

	<?php endif; ?>

	<select 
	class="form-select rounded select2"
	name="<?php echo $module->columns[$i]->title_column ?>" 
	id="<?php echo $module->columns[$i]->title_column ?>">


	 <?php

            if ($module->columns[$i]->title_column == "font_admin") {

                $items = ["inter", "roboto", "poppins", "montserrat"];

            } else {

                $items = explode(",", urldecode($module->columns[$i]->matrix_column));

            }

        ?>

	<?php if ($module->columns[$i]->matrix_column != null || $module->columns[$i]->title_column == "font_admin"): ?>

		<?php foreach ($items as $item): ?>

			<option value="<?= htmlspecialchars($item, ENT_QUOTES, 'UTF-8') ?>"
                <?php if (!empty($data) && urldecode($data[$module->columns[$i]->title_column]) == $item): ?> selected <?php endif ?>>
                <?= htmlspecialchars(ucfirst($item), ENT_QUOTES, 'UTF-8') ?>
            </option>
			
		<?php endforeach ?>
		
	<?php endif ?>

	</select>

<?php endif ?>