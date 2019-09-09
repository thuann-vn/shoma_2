import {
	Platform
} from 'react-native';

export default {
	AmplitudeKey: 'b854cc0dbf5aee9466c3d0ffc1195850',
	SegmentKey: 'RYVnaufBn7SjGpu7rJ4NNN9CnYIWE1lZ',
	FirebaseConfig: {
		apiKey: "AIzaSyCDE7BPb_UnMOwL6Gmd7dPkJ9X8wyRQOoQ",
		authDomain: "shoma-24dde.firebaseapp.com",
		databaseURL: "https://shoma-24dde.firebaseio.com",
		projectId: "shoma-24dde",
		storageBucket: "shoma-24dde.appspot.com",
		messagingSenderId: "57800549753",
		appId: "1:57800549753:web:61c980affb96de43"
	},
	Unsplash: {
		applicationId: "245c2d42d1b7ed4a5218218adff67cedcf43250ba433f7781c1f11ce38584d09",
		secret: "2a8f8ed31312cc389518401f780a9a7bd6b334cb83d8dc7114169567d6ff0c63"
	},
	SentryDNS: 'https://90b088fc160843c6816d07faf953dd29@sentry.io/1483360'
}

export const FBAppID = '367848603795552';

export const AdModID = {
	...Platform.select({
		ios: {
			banner: 'ca-app-pub-0201254777217284/4401610097',
			fullscreen: 'ca-app-pub-0201254777217284/1453052161',
			reward: 'ca-app-pub-0201254777217284/6265619436'
		},
		android: {
			banner: 'ca-app-pub-0201254777217284/1029507534',
			fullscreen: 'ca-app-pub-0201254777217284/5164193661',
			reward: 'ca-app-pub-0201254777217284/7598785314'
		},
	})
};

export const FBAdsID = {
	fullscreen: '675138692940849_675139289607456'
}

export const GoogleAPIKey = 'AIzaSyCrjO01NcP1GPkWfWD1r5fBukv6wt4ajy0';