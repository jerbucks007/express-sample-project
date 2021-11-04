/**
 * 
 * @Contributor: Jerard Joseph Buencamino
 * @Company: Leekie Enterprises
 * @2019
 * @FilePath: lab.config.js
 * @Version: 1.0.0
 * @Created: Monday, 4 February 2019
 * @Changes: -
 * @Desc: PM2 LAB configuration
 * 
 */

module.exports = {
  apps: [{
    name: 'game',
    script: './app.js',
    watch: false,
    env: {
      SAVVY_ENV: 'LAB'
    },
    out_file: '/var/log/game/game.log',
    error_file: '/var/log/game/game.log',
    merge_logs: true,
    node_args: '--max_old_space_size=8192',
    instances: 1,
    exec_mode: 'cluster',
    args: [
      '--color'
    ]
  }]
};