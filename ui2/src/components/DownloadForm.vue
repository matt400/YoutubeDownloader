<template>
	<form class="form_container" method="POST">
		<section class="user_download">
			<div class="user_inputs">
				<input type="text" name="video_url" id="video_url" class="video_url" placeholder="Enter here URL of the video" />
				<div class="actions">
					<div class="actions_list">
						<button type="button" class="action" @click="historyToggle()"><span class="fas fa-history"></span></button>
					</div>
				</div>
			</div>
		</section>
		<div class="ho_group">
			<transition name="slide-fade" mode="out-in">
				<div class="history" v-if="userHistoryMode">
					<div class="user_history row">
						<div class="user_row">
							<div class="file_nr">#3</div>
							<div class="file_name">Blue Oyster Cult - (Don't Fear) The Reaper 1976 [Studio Version]</div>
							<div class="file_type">mp3</div>
							<div class="file_bq">360p @ 128 kbps</div>
							<div class="file_time">05:01</div>
							<div class="file_status tws downloading">10%</div>
							<div class="file_actions"><span class="far fa-trash-alt"></span></div>
						</div>
						<div class="user_row">
							<div class="file_nr">#2</div>
							<div class="file_name">Blue Oyster Cult - (Don't Fear) The Reaper 1976 [Studio Version]</div>
							<div class="file_type">mp3</div>
							<div class="file_bq">360p @ 128 kbps</div>
							<div class="file_time">05:01</div>
							<div class="file_status tws compressing">20%</div>
							<div class="file_actions"><span class="far fa-trash-alt"></span></div>
						</div>
						<div class="user_row">
							<div class="file_nr">#1</div>
							<div class="file_name">Blue Oyster Cult - (Don't Fear) The Reaper 1976 [Studio Version]</div>
							<div class="file_type">mp3</div>
							<div class="file_bq">360p @ 128 kbps</div>
							<div class="file_time">05:01</div>
							<div class="file_status"><span class="fas fa-download"></span></div>
							<div class="file_actions"><span class="far fa-trash-alt"></span></div>
						</div>
					</div>
				</div>
				<section v-else>
					<!-- Row 1 -->
					<div class="row">
						<div class="col-3 optionsLabel format">
							<div class="row">
								<ul class="col-6 options">
									<li class="option" v-for="(audio, index) in audio_formats" :key="index">
										<label :for="'format_' + audio">{{ audio }}
											<input type="radio" name="format_type" :id="'format_' + audio" class="input_control" :value="index" :checked="index === 0" />
											<span class="checkmark radio"></span>
										</label>
									</li>
								</ul>
								<ul class="col-6 options">
									<li class="option" v-for="(video, index) in video_formats" :key="index">
										<label :for="'format_' + video">{{ video }}
											<input type="radio" name="format_type" :id="'format_' + video" class="input_control" :value="index" />
											<span class="checkmark radio"></span>
										</label>
									</li>
								</ul>
							</div>
						</div>
						<div class="col-2 optionsLabel bitrate">
							<ul class="options">
								<li class="option" v-for="(bit, index) in bitrate" :key="index">
									<label :for="'bitrate_' + bit">{{ bit }} kbps
										<input type="radio" name="bitrate" :id="'bitrate_' + bit" class="input_control" :value="index" :checked="index === 0" />
										<span class="checkmark radio"></span>
									</label>
								</li>
							</ul>
						</div>
						<div class="col-7 optionsLabel alo">
							<ul class="options">
								<li class="option">
									<label for="alo_subs">Always add subtitles (if exists) to the video
										<input type="checkbox" name="alo_subs" id="alo_subs" class="input_control" />
										<span class="checkmark checkbox"></span>
									</label>
								</li>
							</ul>
						</div>
					</div>
					<!-- Row 2 -->
					<div class="row">
						<div class="col-12 optionsLabel cut">
							<div class="row">
								<ul class="col-5 options">
									<li class="option" v-for="(option, index) in additional_options" :key="index">
										<label :for="option.id">{{ option.desc }}
											<input type="radio" name="alo_cns" :id="option.id" class="input_control" :value="index" :checked="index === 0">
											<span class="checkmark radio"></span>
										</label>
									</li>
								</ul>
								<ul class="col-6 options">
									<li class="option">
										<label for="alo_ctg">I want choose by myself
											<input type="radio" name="alo_cns" id="alo_ctg" class="input_control" value="4" v-model="alo_cut" />
											<span class="checkmark radio"></span>
										</label>
										<div class="cut_group" v-if="alo_cut === '4'">
											Cut from <input type="time" name="start_with" id="start_with" class="input_xs" step="1" min="00:00:00" max="03:00:00" />
											to <input type="time" name="end_with" id="end_with" class="input_xs" step="1" min="00:00:00" max="03:00:00" />
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</transition>
		</div>
		<section class="submit_section row center">
			<button class="video_proceed">Convert!</button>
			<div class="agreement_text">By using our services, you are agreeing to <a href="#">these</a> terms. Please read them carefully.</div>
		</section>
	</form>
</template>

<script>
export default {
	name: 'IDownloadForm',
	data() {
		return {
			userHistoryMode: 0,
			audio_formats: ["mp3", "aac", "ogg", "wav"],
			video_formats: ["mp4", "m4v", "avi", "wmv"],
			bitrate: [320, 192, 160, 128],
			additional_options: [
				{ id: "alo_nss", desc: "I don't want to cut the video" },
				{ id: "alo_nass", desc: "Cut the video in all sections where is no sound" },
				{ id: "alo_nasb", desc: "Cut the video only at the beginning where is no sound" },
				{ id: "alo_nase", desc: "Cut the video at the end where is no sound" },
			],
			alo_cut: 1
		}
	},
	methods:{
		historyToggle: function() {
			this.userHistoryMode = !this.userHistoryMode;
		}
	}
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all .1s ease;
}
.slide-fade-leave-active {
  transition: all .1s ease-out;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.form_container {
	display: block;
	margin-top: 20px;
	color: #fff;
}

.ho_group {
	height: 300px;
	margin-bottom: 25px;
}

.user_download {
	position: relative;
	margin-bottom: 20px;
}

.user_inputs {
	position: relative;
	width: 100%;
}

.user_inputs {
	height: 67px;
}

.user_inputs .actions {
	position: relative;
	width: 50px;
	height: calc(100% - 2px);
	float: left;
	background: transparent;
	border: 1px solid rgba(255,255,255,0.1);
	border-left: 0;
}

.user_inputs .actions .actions_list {
	position: relative;
	transform: translateY(-50%);
	top: 50%;
	padding: 0 10px;
}

.user_inputs .action {
	background: transparent;
	cursor: pointer;
	color: rgb(255, 255, 255);
	padding: 5px;
	font-size: 18px;
}

.history {
	position: relative;
	height: 100%;
	border: 1px solid rgba(255,255,255,0.1);
	overflow: hidden scroll;
}

.history.no_content:after {
	content: "No history found";
	position: absolute;
	font-size: 3rem;
	color: rgba(255,255,255,0.05);
	top: 50%;
	left: 0;
	right: 0;
	transform: translateY(-50%);
	text-align: center;
}

.history .history_head {
	padding: 8px 0;
	border-bottom: 1px solid rgba(255,255,255,0.1);
	color: rgb(255, 255, 255);
	font-size: .95rem;
	text-align: center;
	text-transform: uppercase;
}

.user_history {
	position: relative;
	color: rgb(255, 255, 255);
	font-size: .84rem;
}

.user_history .file_name {
	width: 50%;
}

.user_history .file_nr,
.user_history .file_actions,
.user_history .file_type {
	width: 5%;
	text-align: center;
}

.user_history .file_bq {
	width: 15%;
	text-align: center;
}

.user_history .file_status,
.user_history .file_time {
	width: 10%;
	text-align: center;
}

.user_history .user_row {
	width: 100%;
	position: relative;
}

.user_history .file_status.tws:after {
	content: "";
	position: absolute;
	background: rgba(255, 255, 255, 0.3);
	width: 20%;
	height: 5px;
	left: 0;
	bottom: 0;
}

.user_history .file_status.tws.downloading:after {
	background: rgba(255, 206, 160, 0.3);
}


.user_history .file_status.tws.compressing:after {
	background: rgba(255, 107, 107, 0.3);
}

.user_history .user_row > div {
	position: relative;
	float: left;
	padding: 15px 10px;
	border-right: 1px solid rgba(255,255,255,0.1);
	border-bottom: 1px solid rgba(255,255,255,0.1);
}

.user_history .user_row > div:last-of-type {
	border-right: 0;
}

.video_url {
	display: block;
	float: left;
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.1);
	width: calc(100% - 50px);
	height: calc(100% - 2px);
	padding: 0 25px;
	font-size: 1.3em;
	border-radius: 0;
	color: #fff;
}

.video_proceed {
	position: relative;
	background: transparent;
	padding: 18px 36px;
	border: 2px solid rgba(255, 255, 255, 0.2);
	text-transform: uppercase;
	color: rgba(216, 216, 216, 0.7);
	text-align: center;
	font-size: 14px;
	cursor: pointer;
	overflow: hidden;
	transition: border-color .5s;
}

.video_proceed:hover {
	border-color: rgba(207, 207, 207, 0.4);
	color: rgb(255, 255, 255);
}

.video_proceed:hover:after {
	transform: translateY(0);
}

.video_proceed:after {
	content: "";
	background: rgba(255, 255, 255, 0.02);
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	transform: translateY(100%);
	transition: transform .2s;
	transition-timing-function: cubic-bezier(.46,.03,.52,.96);
}

.options {
	font-size: 15px;
}

.options .option {
	position: relative;
	padding: 0 0 5px 22px;
	user-select: none;
}

.options .option label {
	cursor: pointer;
}

.options .option:last-of-type {
	padding-bottom: 0;
}

.options .checkmark {
  position: absolute;
	background: transparent;
	border: 1px solid rgba(61, 83, 95, 0.9);
	height: 16px;
  width: 16px;
  top: 0;
  left: 0;
	cursor: pointer;
}

.options .checkmark:after {
	display: none;
  content: "";
  position: absolute;
}

.options .checkmark.radio:after {
	background: rgba(130, 167, 185, 0.5);
	width: 12px;
  height: 12px;
	left: 1px;
	top: 1px;
}

.options .checkmark.checkbox:after {
	border: solid rgba(122, 157, 175, 0.5);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
	left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
}

.options .input_control {
	display: none;
}

.options .option .input_control:checked + .checkmark:after {
	display: block;
}

.optionsLabel.bitrate .options,
.optionsLabel.cut .options,
.optionsLabel.alo .options {
	padding-left: 5px;
	margin-left: 0px;
	margin-top: 0;
}

.optionsLabel .row .col-6 {
	margin-top: 0;
}

.optionsLabel:before {
	display: block;
	position: relative;
	font-size: 14px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	padding: 6px 2px;
	margin-bottom: 8px;
	color: rgba(255, 255, 255, 0.6);
}

.optionsLabel.format:before {
	content: "Choose format";
}

.optionsLabel.bitrate:before {
	content: "Choose bitrate";
}

.optionsLabel.alo:before {
	content: "Additional options";
}

.optionsLabel.cut:before {
	content: "Cut the video";
}

.cut_group {
	padding: 10px 0;
}

.input_xs {
	background: transparent;
	border: 1px solid rgba(61, 83, 95, 0.9);
	color: rgb(175, 175, 175);
	padding: 8px 12px;
	font-size: 16px;
}

.submit_section {
	margin-top: 10px;
}

.agreement_text {
	font-size: 12px;
	color: rgba(255,255,255,0.4);
	margin: 15px 0;
}

.agreement_text a,
.agreement_text a:active,
.agreement_text a:visited {
	font-weight: bold;
	color: rgba(255,255,255,0.4);
}
</style>
