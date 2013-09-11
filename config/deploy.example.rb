set :application, "webtools"
set :user, "username"
set :domain, ""
# Uncomment the line below if your server need credential file.
# ssh_options[:keys] = ["~/.ssh/keypair.pem"]

set :scm, :git
set :repository, "git@github.com:chinghanho/webtools-backend.git"
set :branch, "master"

set :deploy_to, "/home/#{user}/#{application}"
set :keep_releases, 5
set :use_sudo, false
set :normalize_asset_timestamps, false
default_run_options[:pty] = true

set :default_environment, {
  "PATH" => "/home/ubuntu/.nvm/v0.10.18/bin:$PATH"
}
set :forever, "node_modules/forever/bin/forever"

role :web, domain                   # Your HTTP server, Apache/etc
role :app, domain                   # This may be the same as your `Web` server
role :db,  domain, :primary => true # This is where Rails migrations will run

depend :remote, :directory, "#{shared_path}/node_modules"
depend :remote, :directory, "#{shared_path}/config"
depend :remote, :command, "node"
depend :remote, :command, "npm"

before "deploy:refresh_symlink", "deploy:upload_config"
after "deploy:setup", "deploy:additional_setup"
after "deploy:create_symlink", "deploy:refresh_symlink"
after "deploy:restart", "deploy:cleanup"

namespace :deploy do

  desc "Start Forever daemon"
  task :start, :roles => :app do
    run "cd #{current_path} && NODE_ENV=production #{forever} start app.js"
  end

  desc "Stop Forever daemon"
  task :stop, :roles => :app do
    run "cd #{current_path} && #{forever} stopall"
  end

  desc "Restart Forever daemon"
  task :restart, :roles => :app do
    run "cd #{current_path} && #{forever} restartall"
  end

  task :additional_setup, :roles => :app do
    run "mkdir -p #{shared_path}/node_modules"
    run "mkdir -p #{shared_path}/config"
  end

  desc "Refresh shared node_modules symlink to current node_modules"
  task :refresh_symlink, :roles => :app do
    run "rm -rf #{release_path}/node_modules && ln -s #{shared_path}/node_modules #{release_path}/node_modules"
    run "rm -rf #{release_path}/config/config.js && ln -s #{shared_path}/config/config.js #{release_path}/config/config.js"
    run "rm -rf #{release_path}/public/system && ln -s #{shared_path}/system #{release_path}/public/system"
  end

  desc "Install node modules non-globally"
  task :npm_install, :roles => :app do
    run "cd #{current_path} && npm install"
  end

  desc "Upload config files to shared directory"
  task :upload_config, :roles => :app do
    top.upload("./config/config.js", "#{shared_path}/config/config.js", :via => :scp, :recursive => :true)
  end

end
