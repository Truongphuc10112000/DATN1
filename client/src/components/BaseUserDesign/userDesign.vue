<template>
	<div class="profileContainer pt-[127px] bg-zinc-800 text-slate-50">
		<div
			class="flex gap-10 justify-center items-center rounded-full profileHeight md:h-[200px]"
		>
			<div class="center">
				<img
					:src="
						require(`@/uploadImage/${
							userInfos.image ? userInfos.image : 'man.png'
						}`)
					"
					class="profilePhoto rounded-circle"
					alt=""
				/>
			</div>
			<div
				class="pt-2 profile__des bg-zinc-700 md:h-[200px] md:w-[500px] rounded-2xl flex flex-col justify-center items-center"
			>
				<div
					class="w-[100%] d-flex justufy-content-start align-items-center"
				>
					<span class="font6 prUsername">{{ userInfos.username }}</span>
					<!-- <div class="myEditButton f-bold1 crs-pointer">
						Create Design
					</div> -->
				</div>
				<br />
				<div
					class="justufy-content-start w-[100%] align-items-center d-flex gap-4"
				>
					<div>
						<span class="f-bold1">{{
							statisticalByDesign.sumDesign
						}}</span>
						<span> Design</span>
					</div>
					<div>
						<span class="f-bold1">{{
							statisticalByDesign.sumLike
						}}</span>
						<span> Like</span>
					</div>
					<!-- <div>
						<span class="f-bold1">20</span>
						<span> follows</span>
					</div> -->
				</div>
				<br />
				<div class="f-bold1 w-[100%]" style="text-align: left">
					{{ userInfos.title }}
				</div>
				<div
					style="text-align: left"
					class="w-[100%] text-slate-100 mt-1"
				>
					{{ userInfos.description }}
				</div>
			</div>
		</div>
		<br /><br />
		<hr class="p-0 m-0" />
		<div style="height: 53px; gap: 60px" class="center">
			<div
				class="myButtonProfile center f-bold1 font1 cursor-pointer"
				:class="activeOption === 'design' ? 'text-sky-400' : ''"
				@click="onChooseOption('design')"
			>
				Design
			</div>
			<div
				class="myButtonProfile center f-bold1 font1 cursor-pointer"
				@click="onChooseOption('assets')"
				:class="activeOption === 'assets' ? 'text-sky-400' : ''"
			>
				Assets
			</div>
			<div
				class="myButtonProfile center f-bold1 font1 cursor-pointer"
				@click="onChooseOption('favorite')"
				:class="activeOption === 'favorite' ? 'text-sky-400' : ''"
			>
				Favorite
			</div>

			<div
				class="myButtonProfile center f-bold1 font1 cursor-pointer"
				@click="onChooseOption('collection')"
				:class="activeOption === 'collection' ? 'text-sky-400' : ''"
			>
				Collection
			</div>
		</div>
		<baseFilter
			:isStatus="false"
			:typeCatolog="activeOption"
		></baseFilter>
		<div>
			<div
				:style="
					this.$store.state.screenWidth > 730 ? 'gap:28px' : 'gap:10px'
				"
				class="exploreContainer p-1"
			>
				<one-post
					:boxWidth="rowList"
					:data="item"
					:role="'view'"
					v-for="(item, idx) in listDesign"
					:key="idx"
					class="border"
					
					:typeCatolog="activeOption"
					@onClickImage="onPreviweDesign(item)"
					@onDownload="onDownload"
					@CreateFavoriteDesign="creatFavoriteDesign"
					@onMoveUserDesign="onMoveUserDesign"
				></one-post>
			</div>
		</div>
	</div>
	<modalPreview
		:showModal="isShowPreview"
		:infoDesign="infoDesign"
		:type="typePreview"
		@oncloseModal="oncloseModal"
		@CreateFavoriteDesign="creatFavoriteDesign"
	></modalPreview>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import onePost from '@/pages/userInfoDesign/PostBase/one-post.vue';
import ImageAssetService from '@/sevices/imageAssets.service';
import UserService from '@/sevices/user.service';
import modalPreview from '@/components/ModalPreview/modalPreview.vue';
import DesignService from '@/sevices/design.service';
import baseFilter from '@/components/BaseFilter/baseFilter.vue';
const designMappper = createNamespacedHelpers('design');
const authMappper = createNamespacedHelpers('auth');
export default {
	components: {
		onePost,
		modalPreview,
		baseFilter,
	},
	data() {
		return {
			isPopoverOpen: false,
			activeOption: 'design',
			isShowPreview: false,
			typePreview: '',
			infoDesign: '',
			userInfos: '',
			statisticalByDesign: '',
			paramIdUser: '',
		};
	},
	computed: {
		...designMappper.mapState(['listDesign']),
		...authMappper.mapState(['email', 'userInfo']),
	},

	async mounted() {
		const user = await UserService.findByUser({
			userId: this.$route.params.userId,
		});
		this.userInfos = user.data.data[0];
		console.log('this.userInfos', this.userInfo.id);

		await this.getListDesignByUser({
			userId: this.$route.params.userId,
			isPublic: 'public',
			favoriteDesign: this.userInfo.favoriteDesign,
		});

		const statistical = await DesignService.statisticalInfoByDesign({
			idUser: user.data.data[0].id,
		});
		this.statisticalByDesign = statistical.data.data;

		console.log({ user });
	},
	methods: {
		...designMappper.mapActions([
			'getListDesignByUser',
			'handleFavoriteList',
			'getFavoriteDesign',
			'getFavoriteOfUserOther',
		]),
		...designMappper.mapMutations(['SET_LIST_DESIGN']),
		...authMappper.mapMutations(['SET_USER_INFO']),
		async onChooseOption(value) {
			switch (value) {
				case 'design': {
					this.SET_LIST_DESIGN([]);
					this.activeOption = value;
					try {
						await this.getListDesignByUser({
							userId: this.$route.params.userId,
							isPublic: 'public',
							favoriteDesign: this.userInfo.favoriteDesign,
						});
					} catch (error) {
						console.log('error :', error);
					}

					break;
				}
				case 'assets': {
					this.SET_LIST_DESIGN([]);
					this.activeOption = value;
					let imageAsset = await ImageAssetService.getAllImagAsset({
						userId: this.$route.params.userId,
					});
					console.log('imageAsset:', imageAsset);
					this.SET_LIST_DESIGN(imageAsset.data.data);

					console.log('this.listData:', this.listData);
					break;
				}
				case 'favorite': {
					this.SET_LIST_DESIGN([]);
					this.activeOption = value;

					console.log('userinfo:', this.userInfos);

					const favoriteDesign = this.userInfos.favoriteDesign;
					console.log(
						'this.userInfo.favoriteDesign',
						this.userInfos.favoriteDesign
					);
					this.getFavoriteOfUserOther(favoriteDesign);
					// await this.getAllDesign(this.userInfo);
					break;
				}
				case 'collection': {
					this.SET_LIST_DESIGN([]);
					this.activeOption = value;

					console.log('userinfo:', this.userInfos);

					break;
				}

				default:
					break;
			}
		},
		onPreviweDesign(infoDesign) {
			console.log('infoDesign:', infoDesign);
			this.infoDesign = infoDesign;
			this.isShowPreview = true;
			this.typePreview = 'detail';
		},
		oncloseModal() {
			this.isShowPreview = false;
		},
		onDownload(infoDesign) {
			this.typePreview = 'preview';
			this.infoDesign = infoDesign;
			this.isShowPreview = true;
		},

		async creatFavoriteDesign(design) {																																															

			console.log("design: " , design)
			let userInfoUpdate = '';
			if (design.isLike === true) {
				console.log('user info update;', this.userInfo);

					console.log('đã vào đây ');
					const favoriteDesign = await UserService.deleteFavoriteDesign(
						{
							userId: this.userInfo.id,
							designId: design.id,
						}
					);

					console.log("favoriteDesign:",favoriteDesign);
					userInfoUpdate = favoriteDesign;
				
				await DesignService.unLikeDesign({
					idDesign: design.id,
					idUser: this.userInfo.id,
				});

				this.handleFavoriteList({
					designId: design.id,
					type: 'delete',
				});
				this.isUnLike = true;
			} else {

				console.log("đã bắt đầu like")
				const favoriteDesign = await UserService.creatFavoriteDesign({
					userId: this.userInfo.id,
					designId: design.id,
				});
				await DesignService.likeDesign({
					idDesign: design.id,
					idUser: this.userInfo.id,
				});
				userInfoUpdate = favoriteDesign;
				this.handleFavoriteList({
					designId: design.id,
					type: 'create',
				});
				this.isUnLike = false;
			}
			const statistical = await DesignService.statisticalInfoByDesign({
				idUser: this.userInfos.id,
			});

			this.statisticalByDesign = statistical.data.data;


				console.log('design false')
				this.SET_USER_INFO(userInfoUpdate.data?.data);
				localStorage.setItem('tokens', userInfoUpdate.data.token);
			
			// update list design
			if (this.isUnLike === true && this.activeOption === 'favorite' && this.userInfos.id === this.userInfo.id) {

	
				this.getFavoriteDesign(this.userInfo.favoriteDesign);
				this.oncloseModal();
			}
			console.log('like :', userInfoUpdate);
		},

		// async onMoveUserDesign() {
		// 	console.log('dksjkdsjfksdjfk fjjkfskjf');
		// 	const user = await UserService.findByUser({
		// 		userId: this.$route.params.userId,
		// 	});
		// 	this.userInfos = user.data.data[0];

		// 	await this.getListDesignByUser({
		// 		userId: this.$route.params.userId,
		// 		isPublic: 'public',
		// 		favoriteDesign: this.userInfo.favoriteDesign,
		// 	});

		// 	const statistical = await DesignService.statisticalInfoByDesign({
		// 		idUser: user.data.data[0].id,
		// 	});
		// 	this.statisticalByDesign = statistical.data.data;

		// 	console.log({ user });
		// },
	},
};
</script>
<style>
/* @media screen and (min-width: 1200px) {
	.container {
		width: 935px;
	}
} */
.myButtonProfile {
	border-top: 1px solid black;
	height: 100%;
	padding: 0px 10px;
}
.profilePhoto {
	height: 150px;
}
.exploreContainer {
	padding: 0px;
	display: flex;
	flex-wrap: wrap;
}
.prUsername {
	font-weight: 300;
}
.myEditButton {
	font-size: 14px;
	width: 110px;
	height: 30px;
	display: inline-block;
	margin-left: 30px;
	margin-top: 0px;
	border: 1px solid #dbdbdb;
	border-radius: 4px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.profileContainer {
	min-height: 100vh;
	max-height: 100vh;
	overflow: auto;
	height: 100%;
}
.profile__des {
	padding: 10px;
	padding-left: 100px;
	min-height: 200px;
	height: fit-content;
	/* width: 500px; */
}
</style>
