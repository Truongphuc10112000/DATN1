<template>
	<div class="flex items-center justify-center h-[100vh] bg-zinc-800">
		<div class=" w-[70vw] p-4 bg-zinc-700 text-white rounded-xl shadow-lg mt-8 wrapper" >
			<h2 class="font-bold text-3xl text-center mb-3">
				Chỉnh sửa hồ sơ
			</h2>

			<div class="my-2 flex justify-center w-full flex-col">
				<p class="font-semibold text-start text-start">Ảnh:</p>
				<div class="flex flex-row  items-center">
					<img
						:src="
							require(`@/uploadImage/${
								imageProfile ? imageProfile : 'man.png'
							}`)
						"
						alt="AvatarUser"
						width="60"
						height="60"
						class="mr-3 rounded-full w-[70px] h-[70px]"
					/>
					<div
						class="block w-fit cursor-pointer rounded-lg text-sm text-gray-500 bg-black text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold text-start file:bg-black file:text-white file:cursor-pointer p-2"
					>
						<label for="file" class="cursor-pointer"> Upload </label>
						<input
							type="file"
							id="file"
							ref="fileInput"
							class="hidden"
							@input="uploadImageProfile"
						/>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="my-2 flex justify-start flex-col col-6">
					<p class="font-semibold text-start">UserName:</p>
					<input
						type="text"
						placeholder="Nhập tên của bạn"
						class="border border-[#e9e9e9] rounded-2xl p-3 gap-3 w-full focus:outline-none bg-zinc-700"
						v-model="username"
					/>
				</div>

				<div class="my-2 flex justify-start flex-col col-6">
					<p class="font-semibold text-start">Title:</p>
					<input
						type="text"
				
						class="border border-[#e9e9e9] rounded-2xl p-3 gap-3 w-full focus:outline-none bg-zinc-600"
						v-model="title"
				
					/>
				</div>

			</div>

			<div class="row">
				<div class="my-2 flex justify-start flex-col col-6">
					<p class="font-semibold text-start">Password:</p>
					<input
						type="text"
						placeholder="password"
						class="border border-[#e9e9e9] rounded-2xl p-3 gap-3 w-full focus:outline-none bg-zinc-700 "
						v-model="password"
					/>
				</div>

				<div class="my-2 flex justify-start flex-col col-6">
					<p class="font-semibold text-start">Email:</p>
					<input
						type="text"
						placeholder="Example@gmail.com"
						class="border border-[#e9e9e9] rounded-2xl p-3 gap-3 w-full focus:outline-none bg-zinc-600"
						v-model="userInfo.email"
						disabled
					/>
				</div>

			</div>
			<div class="row">

			<div class="my-2 flex justify-start flex-col col-12">
					<p class="font-semibold text-start">Giới thiệu:</p>
					<input
						type="text"
						placeholder="Giới thiệu của bạn"
						class="border border-[#e9e9e9] rounded-2xl p-3 gap-3 w-full focus:outline-none bg-zinc-700"
						v-model="description"
					/>
			</div>
			</div>

			<button
				class="bg-black text-white cursor-pointer p-2 px-4 rounded-3xl max-w-max my-2 flex justify-start flex-col"
				@click="updateProfile"
			>
				Cập nhật
			</button>
		</div>
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
const authMappper = createNamespacedHelpers('auth');
const globalMappper = createNamespacedHelpers('global');
import UserService from '@/sevices/user.service.js';

export default {
	data() {
		return {
			// imageProfile: "",
			username: '',
			email: '',
			password: '',
			description: '',
			title:''
		};
	},
	computed: {
		...authMappper.mapState(['email', 'userInfo', 'imageProfile']),

		imageProfiles() {
			return this.imageProfile;
		},
	},
	mounted() {
		this.SET_IMAGE_PROFILE(this.userInfo.image);
		this.username = this.userInfo.username;
		this.email = this.userInfo.email;
		this.password = this.userInfo.password;
		this.description = this.userInfo.description;
		this.title = this.userInfo.title;
	},
	methods: {
		...authMappper.mapMutations(['SET_USER_INFO', 'SET_IMAGE_PROFILE']),
		...globalMappper.mapActions([
			'uploadImageByS3',
			'uploadImageByProfile',
		]),

		//uploadImageByS3
		async uploadImageProfile(e) {
			e.preventDefault();
			const fileInput = this.$refs.fileInput;

			const upload = await this.uploadImageByProfile(fileInput);
			console.log('Upload', upload.data.data);
			setTimeout(() => {
				this.SET_IMAGE_PROFILE(upload.data.data);
			}, 1000);
		},

		//updateProfile
		async updateProfile() {
			const param = {
				id: this.userInfo.id,
				username: this.username,
				image: this.imageProfile,
				email: this.email,
				title: this.title,
				password: this.password,
				role: this.userInfo.role,
				description: this.description,
				favoriteDesign: this.userInfo.favoriteDesign,
			};
			try {
				const updatedata = await UserService.updateProfile({ param });
				const response = updatedata.data.data;
				response.id = this.userInfo.id;
				localStorage.setItem('tokens', updatedata.data.token);
				this.SET_USER_INFO(response);
				this.$toast.success('update profile success', {
					position: 'top-right',
					duration: 2000,
				});
			} catch (error) {
				console.log({ error });
				this.$toast.error('update profile faile', {
					position: 'top-right',
					duration: 2000,
				});
			}
		},
	},
};
</script>
<style>
.wrapper{
	height:calc(100vh - 104px);
	overflow:auto;
}
</style>
