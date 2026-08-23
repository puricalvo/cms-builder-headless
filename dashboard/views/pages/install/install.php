<div class="container-fluid install-bg">

    <div class="install-wrapper">

				<div class="card install-card">

					<div class="row g-0">

						<div class="col-lg-5 install-left">

							<span class="badge bg-light text-dark mb-2">
							CMS Builder
							Community Edition
							v1.0
							</span>

							<h2>CMS Builder</h2>

							<p class="mt-3">

								Crea aplicaciones CRUD completas en minutos utilizando un dashboard visual y una API REST.

							</p>

							<hr class="border-light opacity-50">

							<div class="step">

								<i class="bi bi-check-circle-fill"></i>

								Instalación en menos de 1 minuto

							</div>

							<div class="step">

								<i class="bi bi-check-circle-fill"></i>

								 Dashboard totalmente configurable

							</div>

							<div class="step">

								<i class="bi bi-check-circle-fill"></i>

								API REST lista para usar

							</div>

							<div class="step">

								<i class="bi bi-check-circle-fill"></i>

								 CRUDs generados automáticamente

							</div>
							<hr class="border-light opacity-50">

								<small class="opacity-75">

								Versión Community<br>

								PHP • MySQL • Bootstrap • API REST

								</small>

						</div>

						<div class="col-lg-7 install-right">


					<form method="POST" class="needs-validation" novalidate>

						<div class="text-center mb-3">

						<img src="https://cdn-icons-png.flaticon.com/512/9966/9966194.png"
							width="50"
							class="mb-2">

							<h3 class="fw-bold mb-1">
								
								Bienvenido a CMS Builder
							</h3>

							<p class="text-muted small">
								Solo necesitas un administrador para comenzar a crear aplicaciones.
							</p>

						</div>


						<hr>


						<div class="form-group mb-1">

							<label class="small fw-bold">
								Correo Administrador <sup>*</sup>
							</label>

							<input 
							type="email"
							class="form-control form-control-sm rounded-3"
							name="email_admin"
							required>

						</div>


						<div class="form-group mb-1">

							<label class="small fw-bold">
								Contraseña Administrador <sup>*</sup>
							</label>

							<input 
							type="password"
							class="form-control form-control-sm rounded-3"
							name="password_admin"
							required>

						</div>


						<div class="form-group mb-1">

							<label class="small fw-bold">
								Nombre del Dashboard <sup>*</sup>
							</label>

							<input 
							type="text"
							class="form-control form-control-sm rounded-3"
							name="title_admin"
							required>

						</div>


						<div class="form-group mb-1">

							<label class="small fw-bold">
								Símbolo del Dashboard <sup>*</sup>
							</label>

							<input 
							type="text"
							class="form-control form-control-sm rounded-3"
							name="symbol_admin"
							required>

						</div>


						<div class="form-group mb-1">

							<label class="small fw-bold">
								Tipografía
							</label>

							<select class="form-select form-select-sm" name="font_admin">

								<option value="inter" selected>Inter (Recomendada)</option>
								<option value="roboto">Roboto</option>
								<option value="poppins">Poppins</option>
								<option value="montserrat">Montserrat</option>
							</select>

						</div>


						<div class="form-group mb-1">

							<label class="small fw-bold">
								Color principal
							</label>

							<input 
							type="color"
							class="form-control form-control-color rounded-3"
							name="color_admin"
							value="#4f46e5">

						</div>


						<div class="form-group mb-1">

							<label class="small fw-bold">
								Imagen de fondo del login
							</label>

							<input 
							type="text"
							class="form-control form-control-sm rounded-3"
							name="back_admin">

						</div>


						<div class="text-muted small mb-2">

							<sup>*</sup> Campos obligatorios

						</div>


						<button 
						type="submit"
						class="btn btn-primary w-100 rounded-3">

							<i class="bi bi-check-circle"></i>
							Instalar Dashboard

						</button>


						<?php 

						require_once "controllers/install.controller.php";

						$install = new InstallController();

						$install->install();

						?>

					</form>


				</div>

            </div>

        </div>

    </div>

</div>


<style>

body{
    margin:0;
    background:linear-gradient(135deg,#eef3ff 0%,#f7f9ff 50%,#ffffff 100%);
}

.install-wrapper{
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:0px;
}

.install-card{
    width:100%;
    max-width:850px;
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 18px 45px rgba(0,0,0,.12);
    transform:scale(.90); 
}

.install-left{
    background:linear-gradient(160deg,#4338CA,#6366F1);
    color:white;
    padding:20px;

}

.install-right{
    padding:20px;
    background:white;
}

.install-left h2{
    font-weight:700;
}

.install-left p{
    opacity:.9;
}

.step{
    display:flex;
    align-items:center;
    gap:10px;
    margin:8px 0;
    font-size:13px;
}

.step i{
    font-size:20px;
    color:#fff;
}

.btn-primary{
    background:#4F46E5;
    border:none;
    border-radius:10px;
    padding:10px;
	font-weight:600;
}

.btn-primary:hover{
    background:#4338CA;
}

.form-control{
    border-radius:10px;
}

.form-control-sm{
    padding:.45rem .70rem;
}



</style>