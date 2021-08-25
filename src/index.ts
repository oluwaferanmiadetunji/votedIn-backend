import http, { Server } from 'http';
import app from './app';
import { PORT } from './config';

const server: Server = http.createServer(app);

const startServer = () => {
	server.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});
};

startServer();

process.on('unhandledRejection', (err: any) => {
	console.log(`Error: ${err}`);
	// Close server and exit process
	server.close(() => process.exit(1));
});

export default server;
